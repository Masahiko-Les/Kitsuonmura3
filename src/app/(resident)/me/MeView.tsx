"use client";

// 自分（試作品の V.me）。届いた回数と自分の語りの一覧は第7段階で追加する
import Link from "next/link";
import { Avatar } from "@/components/Avatar";
import { ChevIcon } from "@/components/icons";
import { TopBar } from "@/components/TopBar";
import { useAuth } from "@/lib/auth/AuthProvider";
import { formatMonth } from "@/lib/format";

export function MeView() {
  const { logout, profile } = useAuth();
  return (
    <>
      <TopBar title="自分" />
      <div className="pad">
        {profile && (
          <Link href={`/residents/${profile.uid}`} className="card">
            <div className="who">
              <Avatar uid={profile.uid} nickname={profile.nickname} large />
              <div>
                <div className="display" style={{ fontSize: 20 }}>
                  {profile.nickname}
                </div>
                <div className="meta">
                  <span>{profile.ageGroup}</span>
                  {profile.createdAt && <span>{formatMonth(profile.createdAt)}に入村</span>}
                </div>
                <span className="small" style={{ color: "var(--green)" }}>
                  自分の住民票を見る
                </span>
              </div>
            </div>
          </Link>
        )}
        <Link href="/me/edit" className="btn ghost block">
          住民票・吃音史を編集する
        </Link>
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
