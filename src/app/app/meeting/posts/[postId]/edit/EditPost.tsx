"use client";

// 自分の語りを書き直す（PRODUCT_SPEC.md §6）
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import { Header } from "@/components/Header";
import { LoadError, Loading } from "@/components/Status";
import { useToast } from "@/components/Toast";
import s from "@/components/ui.module.css";
import { useAuth } from "@/lib/auth/AuthProvider";
import { LIMITS } from "@/lib/constants";
import { getMeetingPost, updateMeetingPost } from "@/lib/firebase/meeting";
import type { MeetingPost } from "@/lib/types";

export function EditPost() {
  const { postId } = useParams<{ postId: string }>();
  const { user } = useAuth();
  const [state, setState] = useState<{ id: string; post: MeetingPost | null } | { id: string; error: true } | null>(null);

  useEffect(() => {
    let alive = true;
    getMeetingPost(postId).then(
      (post) => alive && setState({ id: postId, post }),
      () => alive && setState({ id: postId, error: true }),
    );
    return () => {
      alive = false;
    };
  }, [postId]);

  const cur = state?.id === postId ? state : null;
  return (
    <>
      <Header kind="back" href="/app/me" title="語りを書き直す" />
      <main className={`${s.main} ${s.withNav}`}>
        {!cur ? (
          <Loading />
        ) : "error" in cur ? (
          <LoadError what="語り" />
        ) : !cur.post || cur.post.authorUid !== user?.uid ? (
          <p className={s.muted}>この語りは見つかりませんでした。</p>
        ) : (
          <EditForm key={cur.post.id} post={cur.post} />
        )}
      </main>
    </>
  );
}

function EditForm({ post }: { post: MeetingPost }) {
  const router = useRouter();
  const toast = useToast();
  const [text, setText] = useState(post.text);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const body = text.replace(/^\s*\n|\s+$/g, "");
    if (!body.trim()) return;
    setBusy(true);
    setError("");
    try {
      await updateMeetingPost(post.id, body);
      toast("語りを書き直しました");
      router.push("/app/me");
    } catch {
      setError("保存できませんでした。時間をおいて、もう一度お試しください。");
      setBusy(false);
    }
  };

  return (
    <form onSubmit={onSubmit}>
      <div className={s.field}>
        <label htmlFor="ep-text">あなたの語り</label>
        <textarea id="ep-text" required maxLength={LIMITS.meetingPost} style={{ minHeight: 280 }} value={text} onChange={(e) => setText(e.target.value)} />
        <div className={s.counter}>
          {text.length} / {LIMITS.meetingPost}
        </div>
      </div>
      {error && (
        <p className={s.error} role="alert">
          {error}
        </p>
      )}
      <button className={s.btn} disabled={busy || !text.trim()}>
        {busy ? "保存しています…" : "保存する"}
      </button>
    </form>
  );
}
