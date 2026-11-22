// 住民票の一覧カード（試作品の residentCard()）
import Link from "next/link";
import { readingMinutes, splitTags } from "@/lib/format";
import type { UserProfile } from "@/lib/types";
import { Avatar } from "./Avatar";

export function ResidentCard({ resident: r, isMe = false }: { resident: UserProfile; isMe?: boolean }) {
  const scenes = splitTags(r.hardScenes);
  return (
    <Link href={`/residents/${r.uid}`} className="card">
      <div className="who">
        <Avatar uid={r.uid} nickname={r.nickname} />
        <div>
          <div className="name">
            {r.nickname}
            {isMe && "（あなた）"}
          </div>
          <div className="meta">
            <span>{r.ageGroup}</span>
            {r.region && <span>{r.region}</span>}
            {r.job && <span>{r.job}</span>}
          </div>
        </div>
      </div>
      {scenes.length > 0 && (
        <div className="chips">
          {scenes.map((s, i) => (
            <span key={`${s}-${i}`} className="chip">
              {s}
            </span>
          ))}
        </div>
      )}
      {r.history ? (
        <>
          <p className="small clamp">{r.history}</p>
          <span className="count">吃音史　約{readingMinutes(r.history)}分で読めます</span>
        </>
      ) : (
        <span className="small muted">吃音史はまだ書かれていません</span>
      )}
    </Link>
  );
}
