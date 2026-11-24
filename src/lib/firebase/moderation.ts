// 通報と運営の対応：reports/{targetType_targetId_reporterUid}、各投稿の hidden
// 住民は通報を送るだけ。読む・非表示にする・削除するのは運営（管理者）だけで、ルールでも確かめる
import {
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
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import type { ReportReason } from "../constants";
import { EMPTY_PROFILE_FIELDS, type Report, type ReportTargetType } from "../types";
import { firestore } from "./client";

const COLLECTION: Record<ReportTargetType, string> = { post: "meetingPosts", book: "books", profile: "users" };

export type ReportResult = "sent" | "rejected";

/**
 * 通報を送る。同じ人が同じものを通報できるのは1回だけ（ID で重複を防ぐ）。
 * 2回目や、対象がすでに削除されているときはルールで拒否されるので "rejected" を返す
 */
export async function submitReport(
  targetType: ReportTargetType,
  targetId: string,
  reason: ReportReason,
  details: string,
  uid: string,
): Promise<ReportResult> {
  try {
    await setDoc(doc(firestore(), "reports", `${targetType}_${targetId}_${uid}`), {
      reporterUid: uid,
      targetType,
      targetId,
      reason,
      details,
      status: "open",
      createdAt: serverTimestamp(),
    });
    return "sent";
  } catch (e) {
    if ((e as { code?: string }).code === "permission-denied") return "rejected";
    throw e;
  }
}

export async function listReports(status: Report["status"]): Promise<Report[]> {
  const s = await getDocs(
    query(collection(firestore(), "reports"), where("status", "==", status), orderBy("createdAt", "desc"), limit(100)),
  );
  return s.docs.map((d) => ({ details: "", resolvedAt: null, createdAt: null, ...d.data(), id: d.id }) as Report);
}

export async function countOpenReports() {
  const s = await getCountFromServer(query(collection(firestore(), "reports"), where("status", "==", "open")));
  return s.data().count;
}

export function setReportResolved(id: string, resolved: boolean) {
  return updateDoc(doc(firestore(), "reports", id), {
    status: resolved ? "resolved" : "open",
    resolvedAt: resolved ? serverTimestamp() : null,
  });
}

export function setHidden(type: ReportTargetType, id: string, hidden: boolean) {
  return updateDoc(doc(firestore(), COLLECTION[type], id), { hidden });
}

/** 語り・本の物語を運営が削除する。住民票は運営からは消さない（非表示にする。消すのは本人の退会） */
export function deleteReported(type: "post" | "book", id: string) {
  return deleteDoc(doc(firestore(), COLLECTION[type], id));
}

export type ReportTarget = {
  hidden: boolean;
  /** 書き手（住民票なら本人） */
  authorUid: string;
  authorNickname: string;
  /** 見出し（本の物語の見出しなど） */
  heading: string;
  /** 運営が判断するための本文 */
  text: string;
  /** 住民の画面で開く場所 */
  href: string;
};

/** 通報された対象を読む（運営だけが非表示のものも読める）。削除済みなら null */
export async function getReportTarget(type: ReportTargetType, id: string): Promise<ReportTarget | null> {
  const s = await getDoc(doc(firestore(), COLLECTION[type], id));
  if (!s.exists()) return null;
  const d = s.data();
  const hidden = d.hidden === true;
  if (type === "post") {
    return { hidden, authorUid: d.authorUid, authorNickname: d.authorNickname, heading: "", text: d.text ?? "", href: `/app/meeting/${d.themeId}` };
  }
  if (type === "book") {
    const text = [`『${d.title ?? ""}』${d.bookAuthor ? ` ${d.bookAuthor}` : ""}`, d.struggle, d.words, d.change].filter(Boolean).join("\n\n");
    return { hidden, authorUid: d.authorUid, authorNickname: d.authorNickname, heading: d.heading ?? "", text, href: `/app/library/${id}` };
  }
  // 住民票はどの欄が問題かわからないので、書かれている欄をすべて出す
  const text = Object.keys(EMPTY_PROFILE_FIELDS)
    .map((k) => d[k])
    .filter((v) => typeof v === "string" && v)
    .join("\n\n");
  return { hidden, authorUid: id, authorNickname: d.nickname, heading: "住民票", text, href: `/app/residents/${id}` };
}
