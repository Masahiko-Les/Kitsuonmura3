// 集会：themes/{themeId}、config/meeting、meetingPosts/{postId}
import {
  addDoc,
  collection,
  doc,
  getCountFromServer,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
  startAfter,
  where,
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
  return { reactionCount: 0, createdAt: null, ...d.data(), id: d.id } as MeetingPost;
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
  const s = await getCountFromServer(query(collection(firestore(), "meetingPosts"), where("themeId", "==", themeId)));
  return s.data().count;
}

/** テーマの語りを新しい順に */
export async function listThemePosts(themeId: string, pageSize: number, after?: Cursor) {
  const base = query(collection(firestore(), "meetingPosts"), where("themeId", "==", themeId), orderBy("createdAt", "desc"));
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
    createdAt: serverTimestamp(),
  });
}
