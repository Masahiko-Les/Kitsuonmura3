// 集会の語り1件（試作品の postCard()）
import Link from "next/link";
import { formatDate } from "@/lib/format";
import type { MeetingPost } from "@/lib/types";
import { Avatar } from "./Avatar";
import { ReactionButton } from "./ReactionButton";

export function PostCard({ post: p, mine, reacted }: { post: MeetingPost; mine: boolean; reacted: boolean | undefined }) {
  return (
    <article className="card">
      <Link href={`/residents/${p.authorUid}`} className="who">
        <Avatar uid={p.authorUid} nickname={p.authorNickname} />
        <div>
          <div className="name">
            {p.authorNickname}
            {mine && "（あなた）"}
          </div>
          <div className="meta">
            <span>{p.authorAgeGroup}</span>
            <span>{formatDate(p.createdAt)}</span>
          </div>
        </div>
      </Link>
      <p className="prose">{p.text}</p>
      <ReactionButton target={{ type: "post", id: p.id }} count={p.reactionCount} mine={mine} reacted={reacted} />
    </article>
  );
}
