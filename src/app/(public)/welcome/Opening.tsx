"use client";

// オープニング（試作品の V.opening）。村のイラストと歓迎の言葉を静止画で見せる
import Link from "next/link";
import { useRouter } from "next/navigation";
import { VillageIllustration } from "@/components/VillageIllustration";
import { useAuth } from "@/lib/auth/AuthProvider";
import styles from "./Opening.module.css";

const LINES: { text: string; big?: boolean }[] = [
  { text: "ようこそ、吃音村へ。", big: true },
  { text: "ここは、吃音を抱えながら生きる人たちの小さな村です。" },
  { text: "あなたと同じように、さまざまな苦労を抱えながら生きている人たちがいます。" },
  { text: "私たちは、あなたを歓迎します。" },
];

export function Opening() {
  const router = useRouter();
  const { isResident } = useAuth();

  const later = () => {
    if (window.history.length > 1) router.back();
    else router.push("/");
  };

  return (
    <div className={styles.opening}>
      <VillageIllustration preload />
      <div className={styles.welcome}>
        {LINES.map(({ text, big }) => (
          <p key={text} className={big ? styles.big : undefined}>
            {text}
          </p>
        ))}
        <div className={styles.cta}>
          {isResident ? (
            <Link href="/home" className="btn block">
              村に戻る
            </Link>
          ) : (
            <>
              <Link href="/signup" className="btn block">
                住民票をつくる
              </Link>
              <button type="button" className="btn ghost block" onClick={later}>
                あとで
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
