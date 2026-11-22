import type { Metadata } from "next";
import { Placeholder } from "@/components/Placeholder";

export const metadata: Metadata = { title: "集会" };

export default function Page() {
  return <Placeholder title="集会" stage={5} />;
}
