import type { Metadata } from "next";
import { Placeholder } from "@/components/Placeholder";

export const metadata: Metadata = { title: "ホーム" };

export default function Page() {
  return <Placeholder title="ホーム" stage={3} />;
}
