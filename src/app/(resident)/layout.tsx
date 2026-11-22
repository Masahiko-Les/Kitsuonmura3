import type { Metadata } from "next";
import { BottomNav } from "@/components/BottomNav";

// 住民限定エリア。検索エンジンには出さない。
// ログイン確認（未ログインなら /login へ移動）は第3段階で追加する。
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function ResidentLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <main className="screen">{children}</main>
      <BottomNav />
    </>
  );
}
