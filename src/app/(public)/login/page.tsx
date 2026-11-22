import type { Metadata } from "next";
import { Placeholder } from "@/components/Placeholder";

export const metadata: Metadata = { title: "ログイン", robots: { index: false } };

export default function Page() {
  return <Placeholder title="ログイン" stage={3} back />;
}
