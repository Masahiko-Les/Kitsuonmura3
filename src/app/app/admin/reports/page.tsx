import type { Metadata } from "next";
import { ReportsAdmin } from "./ReportsAdmin";

// 住民限定エリアはブラウザ側で描画するため、即時ナビゲーションの検証対象外
export const instant = false;
export const metadata: Metadata = { title: "通報の確認" };

export default function Page() {
  return <ReportsAdmin />;
}
