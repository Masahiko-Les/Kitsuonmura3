import type { Metadata } from "next";
import { Suspense } from "react";
import { BookDetail } from "./BookDetail";

// 住民限定エリアはブラウザ側で描画するため、即時ナビゲーションの検証対象外
export const instant = false;
export const metadata: Metadata = { title: "図書館" };

export default function Page() {
  // URL のパラメータは事前描画時には決まらないため Suspense で包む
  return (
    <Suspense>
      <BookDetail />
    </Suspense>
  );
}
