import type { Metadata } from "next";
import { Placeholder } from "@/components/Placeholder";

export const metadata: Metadata = { title: "自分" };

export default function Page() {
  return <Placeholder title="自分" stage={7} />;
}
