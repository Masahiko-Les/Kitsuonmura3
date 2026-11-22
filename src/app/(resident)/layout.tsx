import type { Metadata } from "next";
import { Suspense } from "react";
import { AuthGate } from "@/components/AuthGate";
import { BottomNav } from "@/components/BottomNav";

// 住民限定エリア。検索エンジンには出さない。
// 未ログインなら AuthGate が /login へ移動させる。
// ログイン確認とデータ読み込みをブラウザ側で行うため、事前描画できるのは「読み込んでいます」の表示だけ。
// 即時ナビゲーションの検証の対象外にする。
export const instant = false;

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function ResidentLayout({ children }: { children: React.ReactNode }) {
  return (
    // AuthGate と BottomNav は URL を読むため、動的なURL（/residents/[uid] など）では Suspense が必要
    <Suspense>
      <AuthGate>
        <main className="screen">{children}</main>
        <BottomNav />
      </AuthGate>
    </Suspense>
  );
}
