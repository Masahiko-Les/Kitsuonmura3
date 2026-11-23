import type { Metadata } from "next";
import { ResidentsView } from "./ResidentsView";

// 住民限定エリアはブラウザ側で描画するため、即時ナビゲーションの検証対象外
export const instant = false;
export const metadata: Metadata = { title: "住民票" };

export default function Page() {
  return <ResidentsView />;
}
