// 共感ボタン：reactions/{targetType_targetId_uid}
// 作成・削除と、対象の件数の±1を同じトランザクションで行う（ルールでも整合を確かめている）
import {
  collection,
  doc,
  getDocs,
  query,
  runTransaction,
  serverTimestamp,
  where,
} from "firebase/firestore";
import type { ReactionTarget, ReactionType } from "../types";
import { firestore } from "./client";

const TARGET_COLLECTION: Record<ReactionType, string> = {
  post: "meetingPosts",
  book: "books",
  history: "users",
};

const COUNT_FIELD: Record<ReactionType, string> = {
  post: "reactionCount",
  book: "reactionCount",
  history: "historyReactionCount",
};

export function reactionId(t: ReactionTarget, uid: string) {
  return `${t.type}_${t.id}_${uid}`;
}

/** ids のうち、自分が共感したものの集合（一覧で押下状態を出すため。in 句は30件まで） */
export async function myReactions(type: ReactionType, ids: string[], uid: string): Promise<Set<string>> {
  const found = new Set<string>();
  for (let i = 0; i < ids.length; i += 30) {
    const chunk = ids.slice(i, i + 30);
    const s = await getDocs(
      query(
        collection(firestore(), "reactions"),
        where("uid", "==", uid),
        where("targetType", "==", type),
        where("targetId", "in", chunk),
      ),
    );
    s.docs.forEach((d) => found.add(d.data().targetId as string));
  }
  return found;
}

/** 共感する／取り消す。結果の押下状態と件数を返す */
export async function toggleReaction(t: ReactionTarget, uid: string) {
  const db = firestore();
  const rRef = doc(db, "reactions", reactionId(t, uid));
  const tRef = doc(db, TARGET_COLLECTION[t.type], t.id);
  const field = COUNT_FIELD[t.type];
  return runTransaction(db, async (tx) => {
    const [r, target] = await Promise.all([tx.get(rRef), tx.get(tRef)]);
    if (!target.exists()) throw new Error("target-missing");
    const count = (target.data()[field] as number) ?? 0;
    if (r.exists()) {
      tx.delete(rRef);
      tx.update(tRef, { [field]: count - 1 });
      return { reacted: false, count: count - 1 };
    }
    tx.set(rRef, { targetType: t.type, targetId: t.id, uid, createdAt: serverTimestamp() });
    tx.update(tRef, { [field]: count + 1 });
    return { reacted: true, count: count + 1 };
  });
}
