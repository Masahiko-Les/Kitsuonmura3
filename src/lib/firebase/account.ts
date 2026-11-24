// 退会：本人のデータを消してから、ログイン用のアカウントを消す（SECURITY_AND_DATA.md「退会時のアカウント/データ削除方針」）
//
// 消すもの：集会の語り、図書館の本の物語、自分が押した共感、住民票（吃音史を含む）、ログイン用のアカウント。
// 残るもの：通報の記録（運営の対応のため。送り主・対象は uid だけで、住民票が消えると名前はわからない）、
//           ほかの住民があなたの語りに押した共感の記録（対象が消えたので、どこにも表示されない）。
//
// 途中で失敗しても、もう一度実行すれば続きから消せる（消したものを消し直しても失敗しない）。
import { EmailAuthProvider, deleteUser, reauthenticateWithCredential, type User } from "firebase/auth";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  increment,
  query,
  where,
  writeBatch,
  type DocumentReference,
} from "firebase/firestore";
import type { ReactionType } from "../types";
import { firestore } from "./client";

const REACTION_TARGET: Record<ReactionType, [collection: string, field: string]> = {
  post: ["meetingPosts", "reactionCount"],
  book: ["books", "reactionCount"],
  history: ["users", "historyReactionCount"],
};

/** パスワードで本人を確かめる。違えば例外（auth/wrong-password・auth/invalid-credential） */
export function confirmPassword(user: User, password: string) {
  return reauthenticateWithCredential(user, EmailAuthProvider.credential(user.email ?? "", password));
}

async function deleteAll(refs: DocumentReference[]) {
  const db = firestore();
  for (let i = 0; i < refs.length; i += 450) {
    const batch = writeBatch(db);
    refs.slice(i, i + 450).forEach((r) => batch.delete(r));
    await batch.commit();
  }
}

/**
 * 自分が押した共感を取り消す。対象の件数も1減らす（ルールが同時の書き込みを求める）。
 * 対象を読まずに increment(-1) を使うので、運営が非表示にした投稿への共感も取り消せる。
 * 対象がもうなければ、共感の記録だけを消す
 */
async function removeMyReactions(uid: string) {
  const db = firestore();
  const s = await getDocs(query(collection(db, "reactions"), where("uid", "==", uid)));
  for (const r of s.docs) {
    const { targetType, targetId } = r.data() as { targetType: ReactionType; targetId: string };
    const [col, field] = REACTION_TARGET[targetType] ?? [];
    try {
      if (!col) throw new Error("unknown-target");
      const batch = writeBatch(db);
      batch.delete(r.ref);
      batch.update(doc(db, col, targetId), { [field]: increment(-1) });
      await batch.commit();
    } catch {
      await deleteDoc(r.ref);
    }
  }
}

/** 退会する。先に confirmPassword で本人を確かめておくこと */
export async function deleteAccount(user: User) {
  const db = firestore();
  const uid = user.uid;
  const mine = await Promise.all(
    ["meetingPosts", "books"].map((c) => getDocs(query(collection(db, c), where("authorUid", "==", uid)))),
  );
  await deleteAll(mine.flatMap((s) => s.docs.map((d) => d.ref)));
  await removeMyReactions(uid);
  await deleteDoc(doc(db, "users", uid));
  await deleteUser(user);
}
