import type { Metadata } from "next";
import { Placeholder } from "@/components/Placeholder";

export const metadata: Metadata = { title: "住民票" };

export default function Page() {
  return <Placeholder title="住民票" stage={4} />;
}
