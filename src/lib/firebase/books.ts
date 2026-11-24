// 図書館：books/{bookId}（苦労・夢 × 本 × 変化の物語）
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
  startAfter,
  where,
  type DocumentData,
  type DocumentSnapshot,
  type QueryDocumentSnapshot,
} from "firebase/firestore";
import type { Book, BookInput, UserProfile } from "../types";
import { firestore } from "./client";

type Cursor = QueryDocumentSnapshot<DocumentData> | null;

function toBook(d: DocumentSnapshot<DocumentData>): Book {
  return {
    heading: "",
    bookAuthor: "",
    struggle: "",
    words: "",
    change: "",
    reactionCount: 0,
    hidden: false,
    createdAt: null,
    ...d.data(),
    id: d.id,
  } as Book;
}

/** 新しく置かれた順に。運営が非表示にしたものは除く */
export async function listBooks(pageSize: number, after?: Cursor) {
  const base = query(collection(firestore(), "books"), where("hidden", "==", false), orderBy("createdAt", "desc"));
  const s = await getDocs(after ? query(base, startAfter(after), limit(pageSize)) : query(base, limit(pageSize)));
  return {
    books: s.docs.map(toBook),
    cursor: s.docs.length === pageSize ? s.docs[s.docs.length - 1] : null,
  };
}

export async function getBook(id: string) {
  const s = await getDoc(doc(firestore(), "books", id));
  return s.exists() ? toBook(s) : null;
}

export function createBook(input: BookInput, me: UserProfile) {
  return addDoc(collection(firestore(), "books"), {
    ...input,
    authorUid: me.uid,
    authorNickname: me.nickname,
    authorAgeGroup: me.ageGroup,
    reactionCount: 0,
    hidden: false,
    createdAt: serverTimestamp(),
  });
}

/** 自分が本棚に置いた本をすべて、新しい順に */
export async function listMyBooks(uid: string) {
  const s = await getDocs(
    query(collection(firestore(), "books"), where("authorUid", "==", uid), orderBy("createdAt", "desc")),
  );
  return s.docs.map(toBook);
}

export function deleteBook(id: string) {
  return deleteDoc(doc(firestore(), "books", id));
}
