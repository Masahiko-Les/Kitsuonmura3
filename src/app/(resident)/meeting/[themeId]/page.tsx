import type { Metadata } from "next";
import { Suspense } from "react";
import { PastMeeting } from "./PastMeeting";

// 住民限定エリアはブラウザ側で描画するため、即時ナビゲーションの検証対象外（layout.tsx 参照）
export const instant = false;
export const metadata: Metadata = { title: "過去の集会" };

export default function Page() {
  // URLの themeId は事前描画時には決まらないため Suspense で包む
  return (
    <Suspense>
      <PastMeeting />
    </Suspense>
  );
}
