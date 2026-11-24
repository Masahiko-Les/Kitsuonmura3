"use client";

// 住民票の詳細と吃音史
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Header } from "@/components/Header";
import { ReactionButton } from "@/components/ReactionButton";
import { ReportButton } from "@/components/ReportButton";
import { LoadError, Loading } from "@/components/Status";
import s from "@/components/ui.module.css";
import { Who } from "@/components/Who";
import { useAuth } from "@/lib/auth/AuthProvider";
import { myReactions } from "@/lib/firebase/reactions";
import { getResident } from "@/lib/firebase/users";
import { formatMonth, readingMinutes, splitTags } from "@/lib/format";
import type { UserProfile } from "@/lib/types";

const ROWS: [keyof UserProfile, string][] = [
  ["region", "居住地域"],
  ["job", "職業や普段の生活"],
  ["features", "吃音の特徴"],
  ["onset", "吃音が始まった時期"],
  ["hardSounds", "苦手な音"],
  ["hardWords", "苦手な単語"],
  ["struggles", "いま抱えている苦労"],
  ["tips", "自分なりの工夫"],
  ["hobbies", "趣味・好きなこと"],
  ["challenges", "これからやりたいこと"],
];

type State = { uid: string; resident: UserProfile | null } | { uid: string; error: true };

export function ResidentDetail() {
  const { uid } = useParams<{ uid: string }>();
  const { user, profile } = useAuth();
  const me = user?.uid ?? "";
  const isMe = uid === me;
  const [state, setState] = useState<State | null>(null);
  const [reaction, setReaction] = useState<{ uid: string; reacted: boolean } | null>(null);

  useEffect(() => {
    if (isMe) return; // 自分の住民票は購読中のものを使う（編集がすぐ反映される）
    let alive = true;
    getResident(uid).then(
      (r) => alive && setState({ uid, resident: r }),
      // 運営が非表示にした住民票は、本人と運営以外には読めない（ルールで拒否される）
      (e) => alive && setState(e?.code === "permission-denied" ? { uid, resident: null } : { uid, error: true }),
    );
    myReactions("history", [uid], me).then(
      (set) => alive && setReaction({ uid, reacted: set.has(uid) }),
      () => alive && setReaction({ uid, reacted: false }),
    );
    return () => {
      alive = false;
    };
  }, [uid, isMe, me]);

  const current = state?.uid === uid ? state : null;
  const r = isMe ? profile : current && !("error" in current) ? current.resident : null;

  let body;
  if (current && "error" in current) body = <LoadError what="住民票" />;
  else if (!r) body = isMe || !current ? <Loading /> : <p className={s.muted}>この住民票は見つからないか、表示できない状態になっています。</p>;
  else {
    const tags = splitTags(r.hardScenes);
    const rows = ROWS.filter(([k]) => r[k]);
    body = (
      <>
        {r.hidden && (
          <p className={s.hiddenNote}>
            {isMe ? "あなたの住民票は、運営が非表示にしています。ほかの住民には見えません。" : "運営が非表示にしています。ほかの住民には見えません。"}
          </p>
        )}
        <Who uid={r.uid} nickname={r.nickname} ageGroup={r.ageGroup} note={r.createdAt ? `${formatMonth(r.createdAt)}に入村` : undefined} isMe={isMe} link={false} />
        {r.intro && <p className={s.lead}>{r.intro}</p>}
        {tags.length > 0 && (
          <div className={s.tags}>
            {tags.map((t, i) => (
              <span key={`${t}-${i}`} className={s.tag}>
                {t}
              </span>
            ))}
          </div>
        )}
        {isMe && (
          <Link href="/app/me/edit" className={s.btnGhost}>
            住民票を編集する
          </Link>
        )}
        {rows.length > 0 && (
          <div className={s.card}>
            <dl className={s.dl}>
              {rows.map(([k, label]) => (
                <div key={k}>
                  <dt>{label}</dt>
                  <dd>{String(r[k])}</dd>
                </div>
              ))}
            </dl>
          </div>
        )}
        <section className={s.section}>
          <div className={s.row}>
            <h2 className={s.h2}>吃音史</h2>
            {r.history && <span className={`${s.small} ${s.muted}`}>約{readingMinutes(r.history)}分</span>}
          </div>
          {r.history ? (
            <article className={s.card}>
              <p className={s.prose}>{r.history}</p>
              <ReactionButton
                key={r.uid}
                target={{ type: "history", id: r.uid }}
                mine={isMe}
                reacted={reaction?.uid === uid ? reaction.reacted : undefined}
              />
            </article>
          ) : (
            <p className={`${s.small} ${s.muted}`}>
              {isMe ? "吃音史は、書きたくなったときに書けます。書かずに過ごすこともできます。" : "まだ書かれていません。"}
            </p>
          )}
        </section>
        <ReportButton type="profile" id={r.uid} mine={isMe} />
      </>
    );
  }

  return (
    <>
      <Header kind="back" href="/app/residents" title="住民票" />
      <main className={`${s.main} ${s.withNav}`}>{body}</main>
    </>
  );
}
