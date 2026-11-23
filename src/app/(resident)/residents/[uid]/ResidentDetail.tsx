"use client";

// 住民票の詳細と吃音史（試作品の V.resident）
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Avatar } from "@/components/Avatar";
import { ReactionButton } from "@/components/ReactionButton";
import { TopBar } from "@/components/TopBar";
import { useAuth } from "@/lib/auth/AuthProvider";
import { myReactions } from "@/lib/firebase/reactions";
import { getResident } from "@/lib/firebase/users";
import { formatMonth, readingMinutes } from "@/lib/format";
import type { UserProfile } from "@/lib/types";

const ROWS: [keyof UserProfile, string][] = [
  ["features", "吃音の特徴"],
  ["onset", "吃音が始まった時期"],
  ["hardSounds", "苦手な音"],
  ["hardWords", "苦手な単語"],
  ["hardScenes", "苦手な場面"],
  ["struggles", "いま抱えている苦労"],
  ["tips", "自分なりの工夫"],
  ["hobbies", "趣味や好きなこと"],
  ["challenges", "これから挑戦したいこと"],
];

type State = { uid: string; status: "ok"; resident: UserProfile } | { uid: string; status: "missing" | "error" };

export function ResidentDetail() {
  const { uid } = useParams<{ uid: string }>();
  const { user, profile } = useAuth();
  const isMe = uid === user?.uid;
  const [state, setState] = useState<State | null>(null);

  useEffect(() => {
    if (isMe) return; // 自分の住民票は購読中のものを使う（編集がすぐ反映される）
    let alive = true;
    getResident(uid).then(
      (r) => alive && setState(r ? { uid, status: "ok", resident: r } : { uid, status: "missing" }),
      () => alive && setState({ uid, status: "error" }),
    );
    return () => {
      alive = false;
    };
  }, [uid, isMe]);

  // 吃音史に共感済みか
  const me = user?.uid;
  const [reaction, setReaction] = useState<{ uid: string; reacted: boolean } | null>(null);
  useEffect(() => {
    if (isMe || !me) return;
    let alive = true;
    myReactions("history", [uid], me).then(
      (set) => alive && setReaction({ uid, reacted: set.has(uid) }),
      () => alive && setReaction({ uid, reacted: false }),
    );
    return () => {
      alive = false;
    };
  }, [uid, isMe, me]);
  const reacted = reaction?.uid === uid ? reaction.reacted : undefined;

  const current = state?.uid === uid ? state : null;
  const r = isMe ? profile : current?.status === "ok" ? current.resident : null;

  if (!r) {
    const message =
      current?.status === "missing"
        ? "この住民票は見つかりませんでした。"
        : current?.status === "error"
          ? "住民票を読み込めませんでした。時間をおいて、もう一度お試しください。"
          : "読み込んでいます…";
    return (
      <>
        <TopBar title="住民票" back fallbackHref="/residents" />
        <div className="pad">
          <p className="muted small" role="status">
            {message}
          </p>
        </div>
      </>
    );
  }

  const rows = ROWS.filter(([k]) => r[k]);
  const joined = formatMonth(r.createdAt);
  return (
    <>
      <TopBar
        title={`${r.nickname}さんの住民票`}
        back
        fallbackHref="/residents"
        right={
          isMe ? (
            <Link href="/me/edit" className="text-btn">
              編集
            </Link>
          ) : undefined
        }
      />
      <div className="pad">
        <div className="who">
          <Avatar uid={r.uid} nickname={r.nickname} large />
          <div>
            <div className="display" style={{ fontSize: 22 }}>
              {r.nickname}
            </div>
            <div className="meta">
              <span>{r.ageGroup}</span>
              {r.region && <span>{r.region}</span>}
              {joined && <span>{joined}に入村</span>}
            </div>
            {r.job && (
              <div className="small" style={{ marginTop: 2 }}>
                {r.job}
              </div>
            )}
          </div>
        </div>

        {rows.length ? (
          <div className="card">
            <dl className="prof">
              {rows.map(([k, label]) => (
                <div key={k}>
                  <dt>{label}</dt>
                  <dd>{String(r[k])}</dd>
                </div>
              ))}
            </dl>
          </div>
        ) : (
          <p className="muted">まだ書かれている項目はありません。</p>
        )}

        <h2 className="sec">
          吃音史
          {r.history && <span className="count">約{readingMinutes(r.history)}分</span>}
        </h2>
        {r.history ? (
          <article className="card" style={{ padding: 20 }}>
            <p className="prose">{r.history}</p>
            <ReactionButton
              key={r.uid}
              target={{ type: "history", id: r.uid }}
              count={r.historyReactionCount}
              mine={isMe}
              reacted={reacted}
            />
          </article>
        ) : (
          <div className="card">
            <p className="muted small">
              {isMe
                ? "あなたが吃音とどう向き合ってきたかを、自由に書いてみませんか。短くても構いません。"
                : "まだ書かれていません。"}
            </p>
            {isMe && (
              <Link href="/me/edit" className="btn ghost">
                吃音史を書く
              </Link>
            )}
          </div>
        )}
      </div>
    </>
  );
}
