// 書影の代わりに、書名を縦書きした色付きの表紙を描く（試作品の cover()）。外部APIは使わない
import { hashString } from "./Avatar";

const COLORS = ["#2F5D4A", "#7A5E40", "#4D6E80", "#8A4F3F", "#5B5A7A", "#6B7F45"];

export function BookCover({ title, large = false }: { title: string; large?: boolean }) {
  return (
    <div
      className={large ? "cover lg" : "cover"}
      style={{ background: COLORS[hashString(title) % COLORS.length] }}
      aria-hidden="true"
    >
      {[...title].slice(0, large ? 9 : 6).join("")}
    </div>
  );
}
