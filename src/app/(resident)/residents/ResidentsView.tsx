"use client";

// 住民票の一覧（試作品の V.residents）。自分の住民票を先頭に、ほかは新しく村に来た順
import type { DocumentData, QueryDocumentSnapshot } from "firebase/firestore";
import { useCallback, useEffect, useState } from "react";
import { ResidentCard } from "@/components/ResidentCard";
import { TopBar } from "@/components/TopBar";
import { useAuth } from "@/lib/auth/AuthProvider";
import { countResidents, listResidents } from "@/lib/firebase/users";
import type { UserProfile } from "@/lib/types";

const PAGE_SIZE = 30;

export function ResidentsView() {
  const { user, profile } = useAuth();
  const [count, setCount] = useState<number | null>(null);
  const [residents, setResidents] = useState<UserProfile[]>([]);
  const [cursor, setCursor] = useState<QueryDocumentSnapshot<DocumentData> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const load = useCallback(async (after: QueryDocumentSnapshot<DocumentData> | null) => {
    setLoading(true);
    try {
      const page = await listResidents(PAGE_SIZE, after);
      setResidents((prev) => (after ? [...prev, ...page.residents] : page.residents));
      setCursor(page.cursor);
      setError(false);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- 初回の読み込み
    void load(null);
    countResidents().then(setCount, () => setCount(null));
  }, [load]);

  const others = residents.filter((r) => r.uid !== user?.uid);

  return (
    <>
      <TopBar title="住民票" />
      <div className="pad">
        {count !== null && <p className="muted small">吃音村には、{count}人の住民が暮らしています。</p>}
        <div className="list">
          {profile && <ResidentCard resident={profile} isMe />}
          {others.map((r) => (
            <ResidentCard key={r.uid} resident={r} />
          ))}
        </div>
        {error && (
          <p className="error" role="alert">
            住民票を読み込めませんでした。時間をおいて、もう一度お試しください。
          </p>
        )}
        {loading ? (
          <p className="muted small" role="status">
            読み込んでいます…
          </p>
        ) : (
          cursor && (
            <button type="button" className="btn ghost block" onClick={() => void load(cursor)}>
              もっと見る
            </button>
          )
        )}
      </div>
    </>
  );
}
