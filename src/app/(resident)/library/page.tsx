import type { Metadata } from "next";
import { Placeholder } from "@/components/Placeholder";

export const metadata: Metadata = { title: "図書館" };

export default function Page() {
  return <Placeholder title="図書館" stage={6} />;
}
