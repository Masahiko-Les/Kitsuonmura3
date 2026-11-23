// 住民限定エリア。ログインしていなければ /login へ移動させ、下部タブを出す。
// 画面はブラウザ側で描画する（データは firestore.rules で住民だけが読める）。検索エンジンには載せない
import type { Metadata } from "next";
import { Suspense } from "react";
import { AuthGate } from "@/components/AuthGate";
import { BottomNav } from "@/components/BottomNav";

export const instant = false;
export const metadata: Metadata = { robots: { index: false, follow: false } };

export default function ResidentLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense>
      <AuthGate>
        {children}
        <BottomNav />
      </AuthGate>
    </Suspense>
  );
}
