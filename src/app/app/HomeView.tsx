"use client";

// ホーム（reference-ui.png の骨格：村のイラスト、おかえりなさい。、集会・図書館・住民票のカード）。
// 活動の件数は出さない（PRODUCT_SPEC.md §4）
import Link from "next/link";
import { useEffect, useState } from "react";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import s from "@/components/ui.module.css";
import { useAuth } from "@/lib/auth/AuthProvider";
import { getCurrentThemeId, getTheme } from "@/lib/firebase/meeting";
import type { Theme } from "@/lib/types";

export function HomeView() {
  const { profile } = useAuth();
  const [theme, setTheme] = useState<Theme | null>(null);

  useEffect(() => {
    let alive = true;
    getCurrentThemeId()
      .then((id) => (id ? getTheme(id) : null))
      .then(
        (t) => alive && setTheme(t),
        () => {},
      );
    return () => {
      alive = false;
    };
  }, []);

  return (
    <>
      <Header logoHref="/app" />
      <main className={`${s.main} ${s.withNav}`}>
        <Hero preload />
        <div className={s.stack}>
          <h1 className={s.h1}>おかえりなさい{profile ? `、${profile.nickname}さん` : ""}。</h1>
        </div>
        <div className={s.stack}>
          <Link href="/app/meeting" className={s.cardMuted}>
            <span className={s.cardLabel}>今月の集会のテーマ</span>
            <span className={s.cardTitle}>{theme ? theme.title : "今月のテーマを見る"}</span>
            <span className={s.muted}>村人たちの語りを読む</span>
          </Link>
          <Link href="/app/library" className={s.cardMuted}>
            <span className={s.cardLabel}>図書館</span>
            <span className={s.cardTitle}>村人の人生を支えた本</span>
            <span className={s.muted}>苦労と読書の物語に触れる</span>
          </Link>
          <Link href="/app/residents" className={s.cardMuted}>
            <span className={s.cardLabel}>住民票</span>
            <span className={s.cardTitle}>村で暮らす人たち</span>
            <span className={s.muted}>それぞれの吃音史を読む</span>
          </Link>
        </div>
      </main>
    </>
  );
}
