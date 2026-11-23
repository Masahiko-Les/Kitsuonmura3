"use client";

// 住民票・吃音史の編集（試作品の V.meEdit）
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { useToast } from "@/components/Toast";
import { TopBar } from "@/components/TopBar";
import { useAuth } from "@/lib/auth/AuthProvider";
import { AGE_GROUPS, LIMITS, PREFECTURES, type AgeGroup } from "@/lib/constants";
import { updateProfile } from "@/lib/firebase/users";
import type { EditableProfile, UserProfile } from "@/lib/types";

type TextKey = Exclude<keyof EditableProfile, "ageGroup" | "nickname" | "history">;

const SHORT: { key: TextKey; label: string; placeholder?: string; hint?: string }[] = [
  { key: "job", label: "職業やこれまでの経験", placeholder: "例：会社員（営業職）" },
  { key: "features", label: "吃音の特徴", placeholder: "例：最初の音が出にくい" },
  { key: "onset", label: "吃音が始まった時期", placeholder: "例：小学2年生ごろ" },
  { key: "hardSounds", label: "苦手な音", placeholder: "例：か行、た行", hint: "「、」で区切って書けます" },
  { key: "hardWords", label: "苦手な単語", placeholder: "例：自分の名前、ありがとうございます" },
  {
    key: "hardScenes",
    label: "苦手な場面",
    placeholder: "例：電話対応、自己紹介",
    hint: "「、」で区切ると、住民票の一覧にタグとして表示されます",
  },
];
const LONG: { key: TextKey; label: string }[] = [
  { key: "struggles", label: "いま抱えている苦労" },
  { key: "tips", label: "自分なりの工夫" },
];
const SHORT_AFTER: { key: TextKey; label: string }[] = [
  { key: "hobbies", label: "趣味や好きなこと" },
  { key: "challenges", label: "これから挑戦したいこと" },
];

export function EditProfile() {
  const { profile } = useAuth();
  if (!profile) {
    return (
      <>
        <TopBar title="住民票を編集" back fallbackHref="/me" />
        <div className="pad">
          <p className="muted small" role="status">
            読み込んでいます…
          </p>
        </div>
      </>
    );
  }
  // 住民票が読み込めてからフォームを作る（初期値を入れるため）
  return <EditForm profile={profile} />;
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
      job: get("job"),
      features: get("features"),
      onset: get("onset"),
      hardSounds: get("hardSounds"),
      hardWords: get("hardWords"),
      hardScenes: get("hardScenes"),
      struggles: get("struggles"),
      tips: get("tips"),
      hobbies: get("hobbies"),
      challenges: get("challenges"),
      // 吃音史は改行や字下げを残すため trim しない（前後の空行だけ落とす）
      history: String(fd.get("history") ?? "").replace(/^\s*\n|\n\s*$/g, ""),
    };
    setBusy(true);
    setError("");
    try {
      await updateProfile(profile.uid, data, profile);
      toast("住民票を保存しました");
      if (window.history.length > 1) router.back();
      else router.push(`/residents/${profile.uid}`);
    } catch {
      setError("保存できませんでした。時間をおいて、もう一度お試しください。");
      setBusy(false);
    }
  };

  const shortField = ({ key, label, placeholder, hint }: { key: TextKey; label: string; placeholder?: string; hint?: string }) => (
    <div className="field" key={key}>
      <label htmlFor={`e-${key}`}>{label}</label>
      <input id={`e-${key}`} name={key} defaultValue={profile[key]} placeholder={placeholder} maxLength={LIMITS.shortField} />
      {hint && <span className="hint">{hint}</span>}
    </div>
  );

  return (
    <>
      <TopBar title="住民票を編集" back fallbackHref="/me" />
      <div className="pad">
        <p className="note">すべて任意です。書きたいところだけ、書きたいときに。住民票は登録した住民だけが読めます。</p>
        <form onSubmit={onSubmit}>
          <div className="field">
            <label htmlFor="e-nickname">ニックネーム</label>
            <input id="e-nickname" name="nickname" defaultValue={profile.nickname} required maxLength={LIMITS.nickname} />
          </div>
          <div className="field">
            <label htmlFor="e-ageGroup">年代</label>
            <select id="e-ageGroup" name="ageGroup" defaultValue={profile.ageGroup}>
              {AGE_GROUPS.map((a) => (
                <option key={a}>{a}</option>
              ))}
            </select>
          </div>
          <div className="field">
            <label htmlFor="e-region">居住地域</label>
            <select id="e-region" name="region" defaultValue={profile.region}>
              <option value="">選ばない</option>
              {/* 以前に自由記述で入れた値は、選び直すまで残す */}
              {profile.region && !(PREFECTURES as readonly string[]).includes(profile.region) && (
                <option value={profile.region}>{profile.region}</option>
              )}
              {PREFECTURES.map((p) => (
                <option key={p}>{p}</option>
              ))}
            </select>
          </div>
          {SHORT.map(shortField)}
          {LONG.map(({ key, label }) => (
            <div className="field" key={key}>
              <label htmlFor={`e-${key}`}>{label}</label>
              <textarea id={`e-${key}`} name={key} defaultValue={profile[key]} maxLength={LIMITS.longField} />
            </div>
          ))}
          {SHORT_AFTER.map((f) => shortField(f))}
          <div className="field">
            <label htmlFor="e-history">吃音史</label>
            <span className="hint">これまでの人生で、吃音とどう向き合ってきたか。短くても、長くても構いません。</span>
            <textarea
              id="e-history"
              name="history"
              className="tall"
              maxLength={LIMITS.history}
              value={history}
              onChange={(e) => setHistory(e.target.value)}
              aria-describedby="e-history-count"
            />
            <div className="counter" id="e-history-count">
              {history.length} / {LIMITS.history}
            </div>
          </div>
          {error && (
            <p className="error" role="alert">
              {error}
            </p>
          )}
          <button className="btn block" disabled={busy}>
            {busy ? "保存しています…" : "保存する"}
          </button>
        </form>
      </div>
    </>
  );
}
