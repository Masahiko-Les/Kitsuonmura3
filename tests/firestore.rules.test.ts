// firestore.rules のテスト。Firebase Emulator（Java が必要）の上で動かす。
//   npm run test:rules
import { after, before, beforeEach, describe, test } from "node:test";
import { readFileSync } from "node:fs";
import {
  assertFails,
  assertSucceeds,
  initializeTestEnvironment,
  type RulesTestEnvironment,
} from "@firebase/rules-unit-testing";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  increment,
  query,
  serverTimestamp,
  setDoc,
  Timestamp,
  updateDoc,
  where,
  writeBatch,
  type Firestore,
} from "firebase/firestore";

let env: RulesTestEnvironment;

const EMPTY = {
  intro: "", region: "", job: "", features: "", onset: "", hardSounds: "", hardWords: "", hardScenes: "",
  struggles: "", tips: "", hobbies: "", challenges: "", history: "",
};
const profile = (nickname: string) => ({
  nickname, ageGroup: "30代", ...EMPTY, historyReactionCount: 0, hidden: false,
  createdAt: serverTimestamp(), updatedAt: serverTimestamp(),
});

const as = (uid: string, claims: Record<string, unknown> = {}) =>
  env.authenticatedContext(uid, { email_verified: true, ...claims }).firestore() as unknown as Firestore;
const anon = () => env.unauthenticatedContext().firestore() as unknown as Firestore;

/** ルールを無視して下準備する */
async function seed(fn: (db: Firestore) => Promise<unknown>) {
  await env.withSecurityRulesDisabled(async (ctx) => {
    await fn(ctx.firestore() as unknown as Firestore);
  });
}

const past = Timestamp.fromDate(new Date("2026-10-01"));

before(async () => {
  env = await initializeTestEnvironment({
    projectId: "demo-kitsuonmura",
    firestore: { rules: readFileSync("firestore.rules", "utf8") },
  });
});
after(async () => {
  await env.cleanup();
});
beforeEach(async () => {
  await env.clearFirestore();
  await seed(async (db) => {
    for (const [uid, nickname] of [["alice", "あおい"], ["bob", "みなと"]]) {
      await setDoc(doc(db, "users", uid), { ...profile(nickname), createdAt: past, updatedAt: past });
    }
    await setDoc(doc(db, "themes", "2026-10"), { month: "2026-10", title: "先月", description: "", createdAt: past });
    await setDoc(doc(db, "themes", "2026-11"), { month: "2026-11", title: "今月", description: "", createdAt: past });
    await setDoc(doc(db, "config", "meeting"), { currentThemeId: "2026-11" });
    await setDoc(doc(db, "meetingPosts", "p1"), {
      themeId: "2026-11", authorUid: "alice", authorNickname: "あおい", authorAgeGroup: "30代",
      text: "語り", reactionCount: 0, hidden: false, createdAt: past,
    });
    await setDoc(doc(db, "books", "b1"), {
      authorUid: "alice", authorNickname: "あおい", authorAgeGroup: "30代", heading: "見出し", title: "本", bookAuthor: "",
      struggle: "", words: "", change: "", reactionCount: 0, hidden: false, createdAt: past,
    });
  });
});

describe("users（住民票）", () => {
  test("未ログインでは読めない", async () => {
    await assertFails(getDoc(doc(anon(), "users", "alice")));
  });
  test("住民は読める", async () => {
    await assertSucceeds(getDoc(doc(as("bob"), "users", "alice")));
  });
  test("本人だけが作成でき、共感数は0から", async () => {
    await assertSucceeds(setDoc(doc(as("carol"), "users", "carol"), profile("かえで")));
    await assertFails(setDoc(doc(as("carol"), "users", "dave"), profile("x")));
    await assertFails(setDoc(doc(as("dave"), "users", "dave"), { ...profile("x"), historyReactionCount: 3 }));
    await assertFails(setDoc(doc(as("dave"), "users", "dave"), { ...profile("x"), admin: true }));
  });
  test("ひとこと自己紹介は200字まで。ない住民票（旧形式）も編集できる", async () => {
    const ref = doc(as("alice"), "users", "alice");
    await assertSucceeds(updateDoc(ref, { intro: "あ".repeat(200), updatedAt: serverTimestamp() }));
    await assertFails(updateDoc(ref, { intro: "あ".repeat(201), updatedAt: serverTimestamp() }));
  });
  test("吃音史は10,000字まで", async () => {
    const ref = doc(as("alice"), "users", "alice");
    await assertSucceeds(updateDoc(ref, { history: "あ".repeat(10000), updatedAt: serverTimestamp() }));
    await assertFails(updateDoc(ref, { history: "あ".repeat(10001), updatedAt: serverTimestamp() }));
  });
  test("他人の住民票は編集できない", async () => {
    await assertFails(updateDoc(doc(as("bob"), "users", "alice"), { region: "x", updatedAt: serverTimestamp() }));
  });
  test("自分の共感数は変えられない", async () => {
    await assertFails(updateDoc(doc(as("alice"), "users", "alice"), { historyReactionCount: 9, updatedAt: serverTimestamp() }));
  });
  test("退会：本人だけが住民票を削除できる", async () => {
    await assertFails(deleteDoc(doc(as("bob"), "users", "alice")));
    await assertSucceeds(deleteDoc(doc(as("alice"), "users", "alice")));
  });
});

describe("集会", () => {
  const post = (o: Record<string, unknown> = {}) => ({
    themeId: "2026-11", authorUid: "bob", authorNickname: "みなと", authorAgeGroup: "30代",
    text: "語り", reactionCount: 0, hidden: false, createdAt: serverTimestamp(), ...o,
  });
  test("今月のテーマに語れる", async () => {
    await assertSucceeds(addDoc(collection(as("bob"), "meetingPosts"), post()));
  });
  test("過去のテーマには語れない", async () => {
    await assertFails(addDoc(collection(as("bob"), "meetingPosts"), post({ themeId: "2026-10" })));
  });
  test("5,000字まで、空は不可", async () => {
    await assertSucceeds(addDoc(collection(as("bob"), "meetingPosts"), post({ text: "あ".repeat(5000) })));
    await assertFails(addDoc(collection(as("bob"), "meetingPosts"), post({ text: "あ".repeat(5001) })));
    await assertFails(addDoc(collection(as("bob"), "meetingPosts"), post({ text: "" })));
  });
  test("名義やニックネームを偽れない", async () => {
    await assertFails(addDoc(collection(as("bob"), "meetingPosts"), post({ authorUid: "alice" })));
    await assertFails(addDoc(collection(as("bob"), "meetingPosts"), post({ authorNickname: "別人" })));
  });
  test("本文を書き直せるのは本人だけ。削除も本人のみ", async () => {
    await assertSucceeds(updateDoc(doc(as("alice"), "meetingPosts", "p1"), { text: "書き直し", updatedAt: serverTimestamp() }));
    await assertFails(updateDoc(doc(as("bob"), "meetingPosts", "p1"), { text: "x", updatedAt: serverTimestamp() }));
    await assertFails(updateDoc(doc(as("alice"), "meetingPosts", "p1"), { themeId: "2026-10", updatedAt: serverTimestamp() }));
    await assertFails(updateDoc(doc(as("alice"), "meetingPosts", "p1"), { text: "あ".repeat(5001), updatedAt: serverTimestamp() }));
    await assertFails(deleteDoc(doc(as("bob"), "meetingPosts", "p1")));
    await assertSucceeds(deleteDoc(doc(as("alice"), "meetingPosts", "p1")));
  });
  test("ニックネーム変更と同時に、自分の投稿の名前を直せる", async () => {
    const db = as("alice");
    const b = writeBatch(db);
    b.update(doc(db, "users", "alice"), { nickname: "あおば", updatedAt: serverTimestamp() });
    b.update(doc(db, "meetingPosts", "p1"), { authorNickname: "あおば" });
    await assertSucceeds(b.commit());
    await assertFails(updateDoc(doc(db, "meetingPosts", "p1"), { authorNickname: "ちがう名前" }));
  });
});

describe("テーマと今月の集会（管理者のみ）", () => {
  const theme = { month: "2026-12", title: "来月", description: "", createdAt: serverTimestamp() };
  test("住民は追加できない", async () => {
    await assertFails(setDoc(doc(as("bob"), "themes", "2026-12"), theme));
    await assertFails(setDoc(doc(as("bob"), "config", "meeting"), { currentThemeId: "2026-10" }));
  });
  test("管理者はテーマを追加して今月の集会にできる", async () => {
    const db = as("admin", { admin: true });
    const b = writeBatch(db);
    b.set(doc(db, "themes", "2026-12"), theme);
    b.set(doc(db, "config", "meeting"), { currentThemeId: "2026-12" });
    await assertSucceeds(b.commit());
  });
  test("ID と月が違う、存在しないテーマを今月にする、削除するのは不可", async () => {
    const db = as("admin", { admin: true });
    await assertFails(setDoc(doc(db, "themes", "2026-12"), { ...theme, month: "2027-01" }));
    await assertFails(setDoc(doc(db, "config", "meeting"), { currentThemeId: "2030-01" }));
    await assertFails(deleteDoc(doc(db, "themes", "2026-10")));
  });
});

describe("図書館", () => {
  const book = (o: Record<string, unknown> = {}) => ({
    authorUid: "bob", authorNickname: "みなと", authorAgeGroup: "30代", heading: "生きる意味を探していた頃", title: "夜と霧",
    bookAuthor: "", struggle: "", words: "", change: "", reactionCount: 0, hidden: false, createdAt: serverTimestamp(), ...o,
  });
  test("本棚に置ける", async () => {
    await assertSucceeds(addDoc(collection(as("bob"), "books"), book()));
  });
  test("見出しと書名は必須で60字まで、決まった項目だけ", async () => {
    await assertFails(addDoc(collection(as("bob"), "books"), book({ heading: "" })));
    await assertFails(addDoc(collection(as("bob"), "books"), book({ title: "" })));
    await assertFails(addDoc(collection(as("bob"), "books"), book({ title: "あ".repeat(61) })));
    await assertFails(addDoc(collection(as("bob"), "books"), book({ tag: "勇気" })));
  });
  test("削除は本人のみ", async () => {
    await assertFails(deleteDoc(doc(as("bob"), "books", "b1")));
    await assertSucceeds(deleteDoc(doc(as("alice"), "books", "b1")));
  });
});

describe("共感", () => {
  for (const [type, col, id, field] of [
    ["post", "meetingPosts", "p1", "reactionCount"],
    ["book", "books", "b1", "reactionCount"],
    ["history", "users", "alice", "historyReactionCount"],
  ] as const) {
    describe(type, () => {
      const rid = `${type}_${id}_bob`;
      const reaction = { targetType: type, targetId: id, uid: "bob", createdAt: serverTimestamp() };
      const react = (db: Firestore, delta: number, r: Record<string, unknown> = reaction, docId = rid) => {
        const b = writeBatch(db);
        b.set(doc(db, "reactions", docId), r);
        b.update(doc(db, col, id), { [field]: increment(delta) });
        return b.commit();
      };

      test("reactions の作成と件数+1を同時に行える", async () => {
        await assertSucceeds(react(as("bob"), 1));
      });
      test("件数だけ、reactions だけの変更はできない", async () => {
        await assertFails(updateDoc(doc(as("bob"), col, id), { [field]: increment(1) }));
        await assertFails(setDoc(doc(as("bob"), "reactions", rid), reaction));
      });
      test("+2 や二重の共感はできない", async () => {
        await assertFails(react(as("bob"), 2));
        await assertSucceeds(react(as("bob"), 1));
        await assertFails(react(as("bob"), 1));
      });
      test("他人になりすませない", async () => {
        await assertFails(react(as("bob"), 1, { ...reaction, uid: "carol" }, `${type}_${id}_carol`));
      });
      test("自分の投稿には共感できない", async () => {
        const self = { ...reaction, uid: "alice" };
        await assertFails(react(as("alice"), 1, self, `${type}_${id}_alice`));
      });
      test("取り消しは reactions の削除と件数-1を同時に", async () => {
        await assertSucceeds(react(as("bob"), 1));
        await assertFails(deleteDoc(doc(as("bob"), "reactions", rid)));
        const db = as("bob");
        const b = writeBatch(db);
        b.delete(doc(db, "reactions", rid));
        b.update(doc(db, col, id), { [field]: increment(-1) });
        await assertSucceeds(b.commit());
      });
      test("自分の共感だけが読める", async () => {
        await assertSucceeds(react(as("bob"), 1));
        await assertSucceeds(getDoc(doc(as("bob"), "reactions", rid)));
        await assertFails(getDoc(doc(as("carol"), "reactions", rid)));
        await assertSucceeds(getDocs(query(collection(as("bob"), "reactions"), where("uid", "==", "bob"))));
        await assertFails(getDocs(collection(as("bob"), "reactions")));
      });
    });
  }
});

describe("通報と運営の非表示", () => {
  const report = (o: Record<string, unknown> = {}) => ({
    reporterUid: "bob", targetType: "post", targetId: "p1", reason: "attack", details: "", status: "open",
    createdAt: serverTimestamp(), ...o,
  });
  const admin = () => as("root", { admin: true });

  test("住民は通報を送れるが、読めない。同じものへの2回目は不可", async () => {
    const ref = doc(as("bob"), "reports", "post_p1_bob");
    await assertSucceeds(setDoc(ref, report()));
    await assertFails(getDoc(ref));
    await assertFails(setDoc(ref, report({ reason: "spam" })));
    await assertSucceeds(getDoc(doc(admin(), "reports", "post_p1_bob")));
  });
  test("ID・送り主・理由・状態・対象の存在を偽れない", async () => {
    await assertFails(setDoc(doc(as("bob"), "reports", "post_p1_x"), report()));
    await assertFails(setDoc(doc(as("bob"), "reports", "post_p1_bob"), report({ reporterUid: "alice" })));
    await assertFails(setDoc(doc(as("bob"), "reports", "post_p1_bob"), report({ reason: "なんとなく" })));
    await assertFails(setDoc(doc(as("bob"), "reports", "post_p1_bob"), report({ status: "resolved" })));
    await assertFails(setDoc(doc(as("bob"), "reports", "post_none_bob"), report({ targetId: "none" })));
    await assertFails(setDoc(doc(anon(), "reports", "post_p1_bob"), report()));
  });
  test("住民票と本も通報できる", async () => {
    await assertSucceeds(setDoc(doc(as("bob"), "reports", "profile_alice_bob"), report({ targetType: "profile", targetId: "alice" })));
    await assertSucceeds(setDoc(doc(as("bob"), "reports", "book_b1_bob"), report({ targetType: "book", targetId: "b1" })));
  });
  test("対応済みにできるのは運営だけ", async () => {
    await seed((db) => setDoc(doc(db, "reports", "post_p1_bob"), { ...report(), createdAt: past }));
    await assertFails(updateDoc(doc(as("bob"), "reports", "post_p1_bob"), { status: "resolved", resolvedAt: serverTimestamp() }));
    await assertSucceeds(updateDoc(doc(admin(), "reports", "post_p1_bob"), { status: "resolved", resolvedAt: serverTimestamp() }));
    await assertFails(deleteDoc(doc(admin(), "reports", "post_p1_bob")));
  });
  test("運営は語りを非表示にでき、ほかの住民には見えなくなる", async () => {
    await assertFails(updateDoc(doc(as("bob"), "meetingPosts", "p1"), { hidden: true }));
    await assertFails(updateDoc(doc(as("alice"), "meetingPosts", "p1"), { hidden: true }));
    await assertFails(updateDoc(doc(admin(), "meetingPosts", "p1"), { hidden: true, text: "x" }));
    await assertSucceeds(updateDoc(doc(admin(), "meetingPosts", "p1"), { hidden: true }));
    await assertFails(getDoc(doc(as("bob"), "meetingPosts", "p1")));
    await assertSucceeds(getDoc(doc(as("alice"), "meetingPosts", "p1")));
    await assertSucceeds(getDoc(doc(admin(), "meetingPosts", "p1")));
    // 一覧は hidden == false で絞らないと拒否される
    await assertFails(getDocs(query(collection(as("bob"), "meetingPosts"), where("themeId", "==", "2026-11"))));
    await assertSucceeds(
      getDocs(query(collection(as("bob"), "meetingPosts"), where("themeId", "==", "2026-11"), where("hidden", "==", false))),
    );
    await assertSucceeds(getDocs(query(collection(as("alice"), "meetingPosts"), where("authorUid", "==", "alice"))));
  });
  test("運営は語り・本を削除できる", async () => {
    await assertSucceeds(deleteDoc(doc(admin(), "meetingPosts", "p1")));
    await assertSucceeds(deleteDoc(doc(admin(), "books", "b1")));
  });
  test("住民票の非表示：本人は外せず、ほかの住民には見えない", async () => {
    await assertFails(setDoc(doc(as("carol"), "users", "carol"), { ...profile("かえで"), hidden: true }));
    await assertSucceeds(updateDoc(doc(admin(), "users", "alice"), { hidden: true }));
    await assertFails(updateDoc(doc(as("alice"), "users", "alice"), { hidden: false, updatedAt: serverTimestamp() }));
    await assertSucceeds(updateDoc(doc(as("alice"), "users", "alice"), { region: "東京都", updatedAt: serverTimestamp() }));
    await assertFails(getDoc(doc(as("bob"), "users", "alice")));
    await assertSucceeds(getDoc(doc(as("alice"), "users", "alice")));
    await assertSucceeds(getDocs(query(collection(as("bob"), "users"), where("hidden", "==", false))));
  });
});
