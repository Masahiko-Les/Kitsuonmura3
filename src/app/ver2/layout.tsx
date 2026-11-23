// ver2：kitsuon_village_handoff の仕様で作る試作。今の吃音村とは画面もデータも切り離している。
// 架空のデータだけで動き、Firebase にはつながない。検索エンジンには常に載せない。
import type { Metadata } from "next";
import s from "./ver2.module.css";

export const metadata: Metadata = {
  title: { default: "吃音村（ver2 試作）", template: "%s｜吃音村（ver2 試作）" },
  robots: { index: false, follow: false },
};

export default function Ver2Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className={s.root}>
      <p className={s.demoBar}>試作版のデモです。住民・投稿はすべて架空で、入力しても保存されません。</p>
      {children}
    </div>
  );
}
