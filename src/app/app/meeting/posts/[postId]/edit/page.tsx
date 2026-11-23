import type { Metadata } from "next";
import { Suspense } from "react";
import { EditPost } from "./EditPost";

// 住民限定エリアはブラウザ側で描画するため、即時ナビゲーションの検証対象外
export const instant = false;
export const metadata: Metadata = { title: "語りを書き直す" };

export default function Page() {
  // URL のパラメータは事前描画時には決まらないため Suspense で包む
  return (
    <Suspense>
      <EditPost />
    </Suspense>
  );
}
