// 会員エリア（デモ）。下部タブを出す。ログインの確認はしない（データがすべて架空のため）
import { Suspense } from "react";
import { BottomNav } from "../_components/BottomNav";

export default function Ver2AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <Suspense>
        <BottomNav />
      </Suspense>
    </>
  );
}
