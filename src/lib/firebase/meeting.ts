// 集会：themes/{themeId}、config/meeting、meetingPosts/{postId}
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getCountFromServer,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
  startAfter,
  updateDoc,
  where,
  writeBatch,
  type DocumentData,
  type QueryDocumentSnapshot,
} from "firebase/firestore";
import type { MeetingPost, Theme, UserProfile } from "../types";
import { firestore } from "./client";

type Cursor = QueryDocumentSnapshot<DocumentData> | null;

function toTheme(id: string, d: DocumentData): Theme {
  return { id, month: d.month ?? id, title: d.title ?? "", description: d.description ?? "" };
}

function toPost(d: QueryDocumentSnapshot<DocumentData>): MeetingPost {
  return { reactionCount: 0, hidden: false, createdAt: null, ...d.data(), id: d.id } as MeetingPost;
}

/** 今月のテーマの ID。まだテーマがなければ null */
export async function getCurrentThemeId(): Promise<string | null> {
  const s = await getDoc(doc(firestore(), "config", "meeting"));
  return (s.exists() && (s.data().currentThemeId as string)) || null;
}

/** すべてのテーマを新しい月から順に。月に1つなので件数は少ない */
export async function listThemes(): Promise<Theme[]> {
  const s = await getDocs(query(collection(firestore(), "themes"), orderBy("month", "desc")));
  return s.docs.map((d) => toTheme(d.id, d.data()));
}

export async function getTheme(id: string): Promise<Theme | null> {
  const s = await getDoc(doc(firestore(), "themes", id));
  return s.exists() ? toTheme(s.id, s.data()) : null;
}

export async function countThemePosts(themeId: string) {
  const s = await getCountFromServer(query(collection(firestore(), "meetingPosts"), where("themeId", "==", themeId), where("hidden", "==", false)));
  return s.data().count;
}

/** テーマの語りを新しい順に。運営が非表示にしたものは除く（除かないとルールで拒否される） */
export async function listThemePosts(themeId: string, pageSize: number, after?: Cursor) {
  const base = query(
    collection(firestore(), "meetingPosts"),
    where("themeId", "==", themeId),
    where("hidden", "==", false),
    orderBy("createdAt", "desc"),
  );
  const s = await getDocs(after ? query(base, startAfter(after), limit(pageSize)) : query(base, limit(pageSize)));
  return {
    posts: s.docs.map(toPost),
    cursor: s.docs.length === pageSize ? s.docs[s.docs.length - 1] : null,
  };
}

/** 今月のテーマに語りを置く。投稿できるテーマかどうかはルールで確かめる */
export function createMeetingPost(themeId: string, text: string, me: UserProfile) {
  return addDoc(collection(firestore(), "meetingPosts"), {
    themeId,
    authorUid: me.uid,
    authorNickname: me.nickname,
    authorAgeGroup: me.ageGroup,
    text,
    reactionCount: 0,
    hidden: false,
    createdAt: serverTimestamp(),
  });
}

/** 自分の語りをすべて、新しい順に */
export async function listMyPosts(uid: string) {
  const s = await getDocs(
    query(collection(firestore(), "meetingPosts"), where("authorUid", "==", uid), orderBy("createdAt", "desc")),
  );
  return s.docs.map(toPost);
}

/** 自分の語りを書き直す */
export function updateMeetingPost(id: string, text: string) {
  return updateDoc(doc(firestore(), "meetingPosts", id), { text, updatedAt: serverTimestamp() });
}

export async function getMeetingPost(id: string) {
  const s = await getDoc(doc(firestore(), "meetingPosts", id));
  return s.exists() ? ({ reactionCount: 0, hidden: false, createdAt: null, ...s.data(), id: s.id } as MeetingPost) : null;
}

export function deleteMeetingPost(id: string) {
  return deleteDoc(doc(firestore(), "meetingPosts", id));
}

/**
 * テーマを追加する（管理者のみ。ルールでも確かめる）。
 * いちばん新しい月のテーマなら、同じ書き込みで「今月の集会」に切り替える。
 */
export async function addTheme(input: { month: string; title: string; description: string }) {
  const db = firestore();
  const ref = doc(db, "themes", input.month);
  if ((await getDoc(ref)).exists()) throw new Error("theme-exists");
  const current = await getCurrentThemeId();
  const batch = writeBatch(db);
  batch.set(ref, { ...input, createdAt: serverTimestamp() });
  const becomesCurrent = !current || input.month > current;
  if (becomesCurrent) batch.set(doc(db, "config", "meeting"), { currentThemeId: input.month });
  await batch.commit();
  return { becomesCurrent };
}
