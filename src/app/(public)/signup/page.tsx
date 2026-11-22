import type { Metadata } from "next";
import { Placeholder } from "@/components/Placeholder";

export const metadata: Metadata = { title: "住民票をつくる", robots: { index: false } };

export default function Page() {
  return <Placeholder title="住民票をつくる" stage={3} back />;
}
