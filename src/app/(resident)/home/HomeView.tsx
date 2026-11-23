"use client";

// ホーム（試作品の V.home）
import Link from "next/link";
import { useEffect, useState } from "react";
import { bookExcerpt } from "@/components/BookCard";
import { BookCover } from "@/components/BookCover";
import { MapIcon } from "@/components/icons";
import { ResidentCard } from "@/components/ResidentCard";
import { VillageIllustration } from "@/components/VillageIllustration";
import { useAuth } from "@/lib/auth/AuthProvider";
import { listBooks } from "@/lib/firebase/books";
import { countThemePosts, getCurrentThemeId, getTheme } from "@/lib/firebase/meeting";
import { listResidents } from "@/lib/firebase/users";
import { formatThemeMonth } from "@/lib/format";
import type { Book, Theme, UserProfile } from "@/lib/types";

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

  // 図書館に新しく並んだ本
  const [latestBook, setLatestBook] = useState<Book | null>(null);
  useEffect(() => {
    listBooks(null, 1).then(
      (p) => setLatestBook(p.books[0] ?? null),
      () => {},
    );
  }, []);

  return (
    <>
      <VillageIllustration preload />
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
        {latestBook && (
          <Link href={`/library/${latestBook.id}`} className="card">
            <span className="eyebrow">図書館に新しく並んだ本</span>
            <div className="book-row">
              <BookCover title={latestBook.title} />
              <div style={{ display: "flex", flexDirection: "column", gap: 4, minWidth: 0 }}>
                <b>『{latestBook.title}』</b>
                {latestBook.bookAuthor && <span className="small muted">{latestBook.bookAuthor}</span>}
                {bookExcerpt(latestBook) && (
                  <span className="small clamp">
                    {latestBook.authorNickname}さん：{bookExcerpt(latestBook)}
                  </span>
                )}
              </div>
            </div>
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
