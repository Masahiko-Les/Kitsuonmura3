import type { Metadata } from "next";
import { NewBook } from "./NewBook";

// 住民限定エリアはブラウザ側で描画するため、即時ナビゲーションの検証対象外（layout.tsx 参照）
export const instant = false;
export const metadata: Metadata = { title: "本棚に一冊置く" };

export default function Page() {
  return <NewBook />;
}
