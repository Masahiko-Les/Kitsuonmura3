// ニックネームの頭文字を色付きの丸で表示する（試作品の avatar()）
const COLORS = ["#5E7F6A", "#9C7D5B", "#6E8FA0", "#A0674E", "#7A7397", "#4F7A62"];

export function hashString(s: string) {
  return [...s].reduce((a, c) => a + c.charCodeAt(0), 0);
}

export function Avatar({ uid, nickname, large = false }: { uid: string; nickname: string; large?: boolean }) {
  return (
    <span
      className={large ? "av lg" : "av"}
      style={{ background: COLORS[hashString(uid) % COLORS.length] }}
      aria-hidden="true"
    >
      {[...(nickname || "?")][0]}
    </span>
  );
}
