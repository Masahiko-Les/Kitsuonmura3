"use client";

// 自分（試作品の V.me）。届いた回数と自分の語りの一覧は第7段階で追加する
import Link from "next/link";
import { ChevIcon } from "@/components/icons";
import { TopBar } from "@/components/TopBar";
import { useAuth } from "@/lib/auth/AuthProvider";

export function MeView() {
  const { logout } = useAuth();
  return (
    <>
      <TopBar title="自分" />
      <div className="pad">
        <div className="menu">
          <Link href="/guide">
            吃音情報ガイド
            <ChevIcon />
          </Link>
          <Link href="/about">
            吃音村について
            <ChevIcon />
          </Link>
          <Link href="/welcome">
            オープニングをもう一度見る
            <ChevIcon />
          </Link>
          <button type="button" onClick={() => void logout()}>
            ログアウト
            <ChevIcon />
          </button>
        </div>
      </div>
    </>
  );
}
