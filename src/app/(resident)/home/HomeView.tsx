"use client";

// ホーム（試作品の V.home）。図書館の新着は第6段階で追加する
import Link from "next/link";
import { useEffect, useState } from "react";
import { MapIcon } from "@/components/icons";
import { ResidentCard } from "@/components/ResidentCard";
import { VillageIllustration } from "@/components/VillageIllustration";
import { useAuth } from "@/lib/auth/AuthProvider";
import { countThemePosts, getCurrentThemeId, getTheme } from "@/lib/firebase/meeting";
import { listResidents } from "@/lib/firebase/users";
import { formatThemeMonth } from "@/lib/format";
import type { Theme, UserProfile } from "@/lib/types";

export function HomeView() {
  const { user, profile } = useAuth();
  const [newcomers, setNewcomers] = useState<UserProfile[]>([]);

  useEffect(() => {
    listResidents(3).then(
      (p) => setNewcomers(p.residents),
      () => setNewcomers([]),
    );
  }, []);

  // 今月の集会
  const [meeting, setMeeting] = useState<{ theme: Theme; count: number } | null>(null);
  useEffect(() => {
    let alive = true;
    getCurrentThemeId()
      .then(async (id) => {
        const theme = id ? await getTheme(id) : null;
        if (theme && alive) setMeeting({ theme, count: await countThemePosts(theme.id) });
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, []);

  return (
    <>
      <VillageIllustration />
      <div className="pad">
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <h1 className="display" style={{ fontSize: 24 }}>
            おかえりなさい{profile ? `、${profile.nickname}さん` : ""}。
          </h1>
          <p className="display" style={{ fontSize: 16, lineHeight: 1.9 }}>
            ここには、あなたと同じように吃音を抱えながら生きている人たちがいます。
          </p>
        </div>
        {meeting && (
          <Link href="/meeting" className="card">
            <span className="eyebrow">今月の集会　{formatThemeMonth(meeting.theme.month)}</span>
            <b className="display" style={{ fontSize: 18 }}>
              {meeting.theme.title}
            </b>
            <span className="small muted">
              {meeting.count ? `${meeting.count}件の語りが置かれています` : "まだ語りはありません。最初に語ってみませんか"}
            </span>
          </Link>
        )}
        {newcomers.length > 0 && (
          <>
            <h2 className="sec">最近村に来た住民</h2>
            <div className="list">
              {newcomers.map((r) => (
                <ResidentCard key={r.uid} resident={r} isMe={r.uid === user?.uid} />
              ))}
            </div>
          </>
        )}
        <Link href="/guide" className="card">
          <div className="feature">
            <span className="ic">
              <MapIcon />
            </span>
            <div>
              <b>吃音情報ガイド</b>
              <p className="small muted">言友会、自助グループ、相談先をまとめています</p>
            </div>
          </div>
        </Link>
      </div>
    </>
  );
}
