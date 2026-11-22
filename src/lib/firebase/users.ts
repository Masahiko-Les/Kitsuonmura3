// users/{uid} の読み書き
import {
  doc,
  onSnapshot,
  serverTimestamp,
  setDoc,
  type DocumentData,
  type DocumentSnapshot,
} from "firebase/firestore";
import type { AgeGroup } from "../constants";
import { EMPTY_PROFILE_FIELDS, type UserProfile } from "../types";
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
