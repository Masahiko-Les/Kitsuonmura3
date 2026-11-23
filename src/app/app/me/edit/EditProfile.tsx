"use client";

// 住民票・吃音史を書く。ニックネーム以外はすべて任意（PRODUCT_SPEC.md §5）
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { Header } from "@/components/Header";
import { Loading } from "@/components/Status";
import { useToast } from "@/components/Toast";
import s from "@/components/ui.module.css";
import { useAuth } from "@/lib/auth/AuthProvider";
import { AGE_GROUPS, LIMITS, PREFECTURES, type AgeGroup } from "@/lib/constants";
import { updateProfile } from "@/lib/firebase/users";
import type { EditableProfile, UserProfile } from "@/lib/types";

type TextKey = Exclude<keyof EditableProfile, "ageGroup" | "nickname" | "region" | "history">;
type FieldDef = { key: TextKey; label: string; long?: boolean; placeholder?: string; hint?: string };

const FIELDS: FieldDef[] = [
  { key: "intro", label: "ひとこと自己紹介", hint: "住民票の一覧に表示されます。", placeholder: "例：吃音があっても、自分らしく生きていきたい。" },
  { key: "job", label: "職業や普段の生活", placeholder: "例：会社員（営業職）" },
  { key: "features", label: "吃音の特徴", placeholder: "例：最初の音が出にくい" },
  { key: "onset", label: "吃音が始まった時期", placeholder: "例：小学2年生ごろ" },
  { key: "hardSounds", label: "苦手な音", placeholder: "例：か行、た行" },
  { key: "hardWords", label: "苦手な単語", placeholder: "例：自分の名前、ありがとうございます" },
  { key: "hardScenes", label: "苦手な場面", placeholder: "例：電話、自己紹介", hint: "「、」で区切ると、住民票の一覧にタグとして表示されます。" },
  { key: "struggles", label: "いま抱えている苦労", long: true },
  { key: "tips", label: "自分なりの工夫", long: true },
  { key: "hobbies", label: "趣味・好きなこと" },
  { key: "challenges", label: "これからやりたいこと" },
];

export function EditProfile() {
  const { profile } = useAuth();
  return (
    <>
      <Header kind="back" href="/app/me" title="住民票を書く" />
      <main className={`${s.main} ${s.withNav}`}>
        {/* 住民票が読み込めてからフォームを作る（初期値を入れるため） */}
        {profile ? <EditForm profile={profile} /> : <Loading />}
      </main>
    </>
  );
}

function EditForm({ profile }: { profile: UserProfile }) {
  const router = useRouter();
  const toast = useToast();
  const [history, setHistory] = useState(profile.history);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const get = (k: string) => String(fd.get(k) ?? "").trim();
    const nickname = get("nickname");
    if (!nickname) {
      setError("ニックネームを入力してください。");
      return;
    }
    const data: EditableProfile = {
      nickname,
      ageGroup: get("ageGroup") as AgeGroup,
      region: get("region"),
      ...(Object.fromEntries(FIELDS.map((f) => [f.key, get(f.key)])) as Record<TextKey, string>),
      // 吃音史は改行や字下げを残すため trim しない（前後の空行だけ落とす）
      history: String(fd.get("history") ?? "").replace(/^\s*\n|\n\s*$/g, ""),
    };
    setBusy(true);
    setError("");
    try {
      await updateProfile(profile.uid, data, profile);
      toast("住民票を保存しました");
      router.push(`/app/residents/${profile.uid}`);
    } catch {
      setError("保存できませんでした。時間をおいて、もう一度お試しください。");
      setBusy(false);
    }
  };

  const isPrefecture = (PREFECTURES as readonly string[]).includes(profile.region);
  return (
    <>
      <p className={s.note}>ニックネーム以外はすべて任意です。書きたいところだけ、書きたいときに。住民票は登録した住民だけが読めます。</p>
      <form onSubmit={onSubmit}>
        <div className={s.field}>
          <label htmlFor="e-nickname">ニックネーム</label>
          <input id="e-nickname" name="nickname" defaultValue={profile.nickname} required maxLength={LIMITS.nickname} />
        </div>
        <div className={s.field}>
          <label htmlFor="e-ageGroup">年代</label>
          <select id="e-ageGroup" name="ageGroup" defaultValue={profile.ageGroup}>
            {AGE_GROUPS.map((a) => (
              <option key={a}>{a}</option>
            ))}
          </select>
        </div>
        <div className={s.field}>
          <label htmlFor="e-region">居住地域</label>
          <select id="e-region" name="region" defaultValue={profile.region}>
            <option value="">選ばない</option>
            {/* 以前に自由記述で入れた値は、選び直すまで残す */}
            {profile.region && !isPrefecture && <option value={profile.region}>{profile.region}</option>}
            {PREFECTURES.map((p) => (
              <option key={p}>{p}</option>
            ))}
          </select>
          <span className={s.hint}>都道府県までです。詳しい住所は書かないでください。</span>
        </div>
        {FIELDS.map((f) => (
          <div className={s.field} key={f.key}>
            <label htmlFor={`e-${f.key}`}>{f.label}</label>
            {f.long ? (
              <textarea id={`e-${f.key}`} name={f.key} defaultValue={profile[f.key]} maxLength={LIMITS.longField} />
            ) : (
              <input
                id={`e-${f.key}`}
                name={f.key}
                defaultValue={profile[f.key]}
                placeholder={f.placeholder}
                maxLength={f.key === "intro" ? LIMITS.intro : LIMITS.shortField}
              />
            )}
            {f.hint && <span className={s.hint}>{f.hint}</span>}
          </div>
        ))}
        <div className={s.field}>
          <label htmlFor="e-history">吃音史</label>
          <span className={s.hint}>あなたの人生と吃音について。短くても、長くてもかまいません。空欄のままでも大丈夫です。</span>
          <textarea
            id="e-history"
            name="history"
            style={{ minHeight: 320 }}
            maxLength={LIMITS.history}
            value={history}
            onChange={(e) => setHistory(e.target.value)}
            aria-describedby="e-history-count"
          />
          <div className={s.counter} id="e-history-count">
            {history.length} / {LIMITS.history}
          </div>
        </div>
        {error && (
          <p className={s.error} role="alert">
            {error}
          </p>
        )}
        <button className={s.btn} disabled={busy}>
          {busy ? "保存しています…" : "保存する"}
        </button>
      </form>
    </>
  );
}
