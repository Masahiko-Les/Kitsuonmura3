"use client";

// ホーム（試作品の V.home）。今月の集会・図書館の新着・最近村に来た住民は各段階で追加する
import Link from "next/link";
import { MapIcon } from "@/components/icons";
import { VillageIllustration } from "@/components/VillageIllustration";
import { useAuth } from "@/lib/auth/AuthProvider";

export function HomeView() {
  const { profile } = useAuth();
  return (
    <>
      <VillageIllustration />
      <div className="pad">
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <h1 className="display" style={{ fontSize: 24 }}>
            おかえりなさい{profile ? `、${profile.nickname}さん` : ""}。
          </h1>
          <p className="display" style={{ fontSize: 16, lineHeight: 1.9 }}>
            ここには、あなたと同じように吃音を抱えながら生きている人たちがいます。
          </p>
        </div>
        <Link href="/guide" className="card">
          <div className="feature">
            <span className="ic">
              <MapIcon />
            </span>
            <div>
              <b>吃音情報ガイド</b>
              <p className="small muted">言友会、自助グループ、相談先をまとめています</p>
            </div>
          </div>
        </Link>
      </div>
    </>
  );
}
