import type { Metadata } from "next";
import { Suspense } from "react";
import { ResidentDetail } from "./ResidentDetail";

// 住民限定エリアはブラウザ側で描画するため、即時ナビゲーションの検証対象外（layout.tsx 参照）
export const instant = false;
export const metadata: Metadata = { title: "住民票" };

export default function ResidentPage() {
  // URLの uid は事前描画時には決まらないため Suspense で包む
  return (
    <Suspense>
      <ResidentDetail />
    </Suspense>
  );
}
