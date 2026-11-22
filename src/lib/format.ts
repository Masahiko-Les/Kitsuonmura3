// 表示用の小さな整形関数

/** "2026-11-22" → "2026年11月22日"。形式が違えばそのまま返す */
export function formatIsoDate(iso: string) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!m) return iso;
  return `${Number(m[1])}年${Number(m[2])}月${Number(m[3])}日`;
}

/** 500字＝1分で読了時間を出す（最低1分） */
export function readingMinutes(text: string | undefined | null) {
  return Math.max(1, Math.round((text ?? "").length / 500));
}

/** 「、」区切りの文字列をタグの配列にする */
export function splitTags(text: string | undefined | null) {
  return (text ?? "")
    .split(/[、,，]/)
    .map((x) => x.trim())
    .filter(Boolean);
}
