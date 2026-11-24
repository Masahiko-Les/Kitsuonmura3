"use client";

// ホーム（reference-ui.png の骨格：村のイラスト、おかえりなさい。、集会・図書館・住民票のカード）。
// 活動の件数は出さない（PRODUCT_SPEC.md §4）
import Link from "next/link";
import { useEffect, useState } from "react";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import s from "@/components/ui.module.css";
import { useAuth } from "@/lib/auth/AuthProvider";
import { getCurrentThemeId, getTheme, hasPostedIn } from "@/lib/firebase/meeting";
import type { Theme } from "@/lib/types";

export function HomeView() {
  const { user, profile } = useAuth();
  const uid = user?.uid ?? "";
  const [theme, setTheme] = useState<Theme | null>(null);
  // 今月の集会にまだ語っていないか。確かめられるまでは何も出さない
  const [notYet, setNotYet] = useState(false);

  useEffect(() => {
    let alive = true;
    getCurrentThemeId()
      .then((id) => (id ? getTheme(id) : null))
      .then(
        async (t) => {
          if (!alive) return;
          setTheme(t);
          if (t && uid) {
            const posted = await hasPostedIn(t.id, uid).catch(() => true);
            if (alive) setNotYet(!posted);
          }
        },
        () => {},
      );
    return () => {
      alive = false;
    };
  }, [uid]);

  return (
    <>
      <Header logoHref="/app" />
      <main className={`${s.main} ${s.withNav}`}>
        <Hero preload />
        <div className={s.stack}>
          <h1 className={s.h1}>おかえりなさい{profile ? `、${profile.nickname}さん` : ""}。</h1>
          {notYet && <p className={s.lead}>今月の集会に、自分のエピソードや想いを文章で語ってみましょう。</p>}
        </div>
        <div className={s.stack}>
          <Link href="/app/meeting" className={s.cardMuted}>
            <span className={s.cardLabel}>今月の集会のテーマ</span>
            <span className={s.cardTitle}>{theme ? `“${theme.title}”` : "今月のテーマを見る"}</span>
            <span className={s.muted} style={{ textAlign: "right" }}>村人たちの語りを読む</span>
          </Link>
          <Link href="/app/library" className={s.cardMuted}>
            <span className={s.cardLabel}>図書館</span>
            <span className={s.cardTitle}>村人の人生を支えた本</span>
            <span className={s.muted} style={{ textAlign: "right" }}>苦労と読書の物語に触れる</span>
          </Link>
          <Link href="/app/residents" className={s.cardMuted}>
            <span className={s.cardLabel}>住民票</span>
            <span className={s.cardTitle}>村で暮らす人たち</span>
            <span className={s.muted} style={{ textAlign: "right" }}>それぞれの吃音史を読む</span>
          </Link>
        </div>
      </main>
    </>
  );
}
