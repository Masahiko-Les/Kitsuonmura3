"use client";

// オープニング演出（試作品の V.opening）
// 村が建つ → 船が港に着く → 旅人が上陸 → 住民が迎える → 歓迎の4行が順に現れる。
// 「スキップ」で最終状態に飛ぶ。prefers-reduced-motion では globals.css の指定でアニメーションしない。
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLayoutEffect, useState, type CSSProperties } from "react";
import { VillageIllustration } from "@/components/VillageIllustration";
import styles from "./Opening.module.css";

const LINES: { text: string; delay: number; big?: boolean }[] = [
  { text: "ようこそ、吃音村へ。", delay: 4.6, big: true },
  { text: "ここは、吃音を抱えながら生きる人たちの小さな村です。", delay: 5.4 },
  { text: "あなたと同じように、さまざまな苦労を抱えながら生きている人たちがいます。", delay: 6.1 },
  { text: "私たちは、あなたを歓迎します。", delay: 6.8 },
];

export function Opening() {
  const router = useRouter();
  const [skipped, setSkipped] = useState(false);

  // Next.js はページを離れても状態を保持するので、離れるときに戻しておく。
  // 次に開いたときは最初から再生される（自分ページからの再生用）。
  useLayoutEffect(() => {
    return () => setSkipped(false);
  }, []);

  const later = () => {
    if (window.history.length > 1) router.back();
    else router.push("/");
  };

  const animated = !skipped;
  return (
    <div className={`${styles.opening} ${animated ? styles.anim : ""}`}>
      {animated && (
        <button type="button" className={styles.skip} onClick={() => setSkipped(true)}>
          スキップ
        </button>
      )}
      <VillageIllustration animated={animated} />
      <div className={styles.welcome}>
        {LINES.map(({ text, delay, big }) => (
          <p
            key={text}
            className={`${styles.wl} ${big ? styles.big : ""}`}
            style={{ "--d": `${delay}s` } as CSSProperties}
          >
            {text}
          </p>
        ))}
        {/* ログイン済みなら「村に戻る」にする（第3段階で認証と接続） */}
        {/* 最後のボタンが現れたら演出は終わり。スキップボタンを消す */}
        <div className={styles.cta} onAnimationEnd={() => setSkipped(true)}>
          <Link href="/signup" className="btn block">
            住民票をつくる
          </Link>
          <button type="button" className="btn ghost block" onClick={later}>
            あとで
          </button>
        </div>
      </div>
    </div>
  );
}
