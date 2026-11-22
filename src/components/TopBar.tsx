"use client";

// 画面上部のバー。back を付けると戻るボタンを出す（試作品の bar()／topbar()）
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { BackIcon } from "./icons";
import styles from "./TopBar.module.css";

type Props = {
  title: string;
  /** 戻るボタンを出す。履歴がないときは fallbackHref に移動する */
  back?: boolean;
  fallbackHref?: string;
  right?: ReactNode;
};

export function TopBar({ title, back = false, fallbackHref = "/", right }: Props) {
  const router = useRouter();
  const goBack = () => {
    if (window.history.length > 1) router.back();
    else router.push(fallbackHref);
  };
  return (
    <header className={styles.bar}>
      {back ? (
        <button type="button" className={styles.iconBtn} onClick={goBack} aria-label="戻る">
          <BackIcon />
        </button>
      ) : (
        <span className={styles.spacer} />
      )}
      <h1>{title}</h1>
      {right ?? <span className={styles.spacer} />}
    </header>
  );
}
