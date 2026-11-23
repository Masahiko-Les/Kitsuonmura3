"use client";

// 自分：住民票、自分の語り（書き直し・削除）、設定と案内（PRODUCT_SPEC.md §4）
import Link from "next/link";
import { useEffect, useState } from "react";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { Header } from "@/components/Header";
import { LoadError, Loading } from "@/components/Status";
import { useToast } from "@/components/Toast";
import s from "@/components/ui.module.css";
import { Who } from "@/components/Who";
import { useAuth } from "@/lib/auth/AuthProvider";
import { deleteBook, listMyBooks } from "@/lib/firebase/books";
import { deleteMeetingPost, listMyPosts, listThemes } from "@/lib/firebase/meeting";
import { formatDate, formatMonth } from "@/lib/format";
import type { Book, MeetingPost } from "@/lib/types";

type Works = { uid: string; posts: MeetingPost[]; books: Book[]; themeTitles: Record<string, string> };
type Target = { kind: "post" | "book"; id: string };

export function MeView() {
  const { user, profile, logout } = useAuth();
  const toast = useToast();
  const uid = user?.uid ?? "";
  const [works, setWorks] = useState<Works | null>(null);
  const [error, setError] = useState(false);
  const [target, setTarget] = useState<Target | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [admin, setAdmin] = useState(false);

  useEffect(() => {
    if (!uid) return;
    let alive = true;
    Promise.all([listMyPosts(uid), listMyBooks(uid), listThemes()]).then(
      ([posts, books, themes]) =>
        alive && setWorks({ uid, posts, books, themeTitles: Object.fromEntries(themes.map((t) => [t.id, t.title])) }),
      () => alive && setError(true),
    );
    user?.getIdTokenResult().then(
      (r) => alive && setAdmin(r.claims.admin === true),
      () => {},
    );
    return () => {
      alive = false;
    };
  }, [uid, user]);

  const w = works?.uid === uid ? works : null;

  const onConfirm = async () => {
    if (!target || deleting) return;
    setDeleting(true);
    try {
      if (target.kind === "post") await deleteMeetingPost(target.id);
      else await deleteBook(target.id);
      setWorks((x) => x && { ...x, posts: x.posts.filter((p) => p.id !== target.id), books: x.books.filter((b) => b.id !== target.id) });
      toast("削除しました");
    } catch {
      toast("削除できませんでした。時間をおいて、もう一度お試しください。");
    } finally {
      setDeleting(false);
      setTarget(null);
    }
  };

  return (
    <>
      <Header logoHref="/app" />
      <main className={`${s.main} ${s.withNav}`}>
        {profile ? (
          <div className={s.card}>
            <Who
              uid={profile.uid}
              nickname={profile.nickname}
              ageGroup={profile.ageGroup}
              note={profile.createdAt ? `${formatMonth(profile.createdAt)}に入村` : undefined}
            />
            {!profile.intro && !profile.history && (
              <p className={`${s.small} ${s.muted}`}>住民票はまだ書かれていません。書かずに過ごすこともできます。</p>
            )}
            <Link href="/app/me/edit" className={s.btnGhost}>
              住民票・吃音史を書く
            </Link>
          </div>
        ) : (
          <Loading />
        )}

        <section className={s.section}>
          <h2 className={s.h2}>あなたの語り</h2>
          {error ? (
            <LoadError what="あなたの語り" />
          ) : !w ? (
            <Loading />
          ) : w.posts.length || w.books.length ? (
            <div className={s.stack}>
              {w.posts.map((p) => (
                <div key={p.id} className={s.card}>
                  <span className={s.cardLabel}>集会　{w.themeTitles[p.themeId] ?? p.themeId}</span>
                  <p className={`${s.small}`} style={{ whiteSpace: "pre-wrap" }}>
                    {p.text.length > 120 ? `${p.text.slice(0, 120)}…` : p.text}
                  </p>
                  <div className={s.row}>
                    <span className={s.meta}>{formatDate(p.createdAt)}</span>
                    <span>
                      <Link href={`/app/meeting/posts/${p.id}/edit`} className={s.headerLink}>
                        書き直す
                      </Link>
                      <button type="button" className={s.dangerBtn} onClick={() => setTarget({ kind: "post", id: p.id })}>
                        削除
                      </button>
                    </span>
                  </div>
                </div>
              ))}
              {w.books.map((b) => (
                <div key={b.id} className={s.card}>
                  <span className={s.cardLabel}>図書館　『{b.title}』</span>
                  <Link href={`/app/library/${b.id}`} className={s.cardTitle}>
                    {b.heading}
                  </Link>
                  <div className={s.row}>
                    <span className={s.meta}>{formatDate(b.createdAt)}</span>
                    <button type="button" className={s.dangerBtn} onClick={() => setTarget({ kind: "book", id: b.id })}>
                      削除
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className={`${s.small} ${s.muted}`}>集会や図書館に置いた語りが、ここに並びます。自分でいつでも消せます。</p>
          )}
        </section>

        <section className={s.section}>
          <h2 className={s.h2}>設定と案内</h2>
          <nav className={s.menu}>
            <Link href="/reset-password">パスワードを変更する（メールで再設定）</Link>
            <Link href="/guide">吃音情報ガイド・相談先</Link>
            <Link href="/about">吃音村について</Link>
            <Link href="/welcome">はじめの案内をもう一度見る</Link>
            {admin && <Link href="/app/admin/themes">集会テーマの管理</Link>}
            <button type="button" onClick={() => void logout()}>
              ログアウト
            </button>
          </nav>
          <p className={`${s.small} ${s.muted}`}>
            村は医療や危機対応の場ではありません。つらいときは、専門の相談先を頼ってください。退会の手続きは、これから用意します。
          </p>
        </section>

        <ConfirmDialog
          open={!!target}
          message="この語りを削除しますか？削除すると、ほかの住民も読めなくなります。"
          confirmLabel={deleting ? "削除しています…" : "削除する"}
          onConfirm={onConfirm}
          onCancel={() => setTarget(null)}
        />
      </main>
    </>
  );
}
