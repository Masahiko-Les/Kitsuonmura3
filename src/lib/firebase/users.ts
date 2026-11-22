// users/{uid} の読み書き
import {
  collection,
  doc,
  getCountFromServer,
  getDoc,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  startAfter,
  updateDoc,
  type QueryDocumentSnapshot,
  type DocumentData,
  type DocumentSnapshot,
} from "firebase/firestore";
import type { AgeGroup } from "../constants";
import { EMPTY_PROFILE_FIELDS, type EditableProfile, type UserProfile } from "../types";
import { firestore } from "./client";

export function toProfile(snap: DocumentSnapshot<DocumentData>): UserProfile | null {
  if (!snap.exists()) return null;
  const d = snap.data();
  return {
    ...EMPTY_PROFILE_FIELDS,
    historyReactionCount: 0,
    createdAt: null,
    updatedAt: null,
    ...d,
    uid: snap.id,
  } as UserProfile;
}

/** 新規登録時に住民票を作る。ニックネームと年代以外は空欄 */
export function createProfile(uid: string, nickname: string, ageGroup: AgeGroup) {
  return setDoc(doc(firestore(), "users", uid), {
    nickname,
    ageGroup,
    ...EMPTY_PROFILE_FIELDS,
    historyReactionCount: 0,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

export function subscribeProfile(uid: string, cb: (p: UserProfile | null) => void, onError?: (e: Error) => void) {
  return onSnapshot(doc(firestore(), "users", uid), (s) => cb(toProfile(s)), onError);
}

export async function getResident(uid: string) {
  return toProfile(await getDoc(doc(firestore(), "users", uid)));
}

export async function countResidents() {
  const snap = await getCountFromServer(collection(firestore(), "users"));
  return snap.data().count;
}

export type ResidentPage = {
  residents: UserProfile[];
  /** 次のページを読むときに渡す。最後のページなら null */
  cursor: QueryDocumentSnapshot<DocumentData> | null;
};

/** 新しく村に来た順に住民票を読む */
export async function listResidents(pageSize: number, after?: QueryDocumentSnapshot<DocumentData> | null): Promise<ResidentPage> {
  const base = query(collection(firestore(), "users"), orderBy("createdAt", "desc"));
  const q = after ? query(base, startAfter(after), limit(pageSize)) : query(base, limit(pageSize));
  const snap = await getDocs(q);
  return {
    residents: snap.docs.map((d) => toProfile(d)!),
    cursor: snap.docs.length === pageSize ? snap.docs[snap.docs.length - 1] : null,
  };
}

/** 住民票の編集を保存する */
export function updateProfile(uid: string, data: EditableProfile) {
  return updateDoc(doc(firestore(), "users", uid), { ...data, updatedAt: serverTimestamp() });
}
