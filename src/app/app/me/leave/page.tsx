import type { Metadata } from "next";
import { LeaveView } from "./LeaveView";

// 住民限定エリアはブラウザ側で描画するため、即時ナビゲーションの検証対象外
export const instant = false;
export const metadata: Metadata = { title: "退会する" };

export default function Page() {
  return <LeaveView />;
}
