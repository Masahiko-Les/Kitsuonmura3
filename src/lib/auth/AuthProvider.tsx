"use client";

// ログイン状態と自分の住民票をアプリ全体に配る
import { onAuthStateChanged, signOut, type User } from "firebase/auth";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { REQUIRE_EMAIL_VERIFICATION } from "../constants";
import { firebaseAuth } from "../firebase/client";
import { subscribeProfile } from "../firebase/users";
import type { UserProfile } from "../types";

export type AuthState = {
  /** 最初のログイン状態の確認が終わるまで true */
  loading: boolean;
  user: User | null;
  /** 住民限定エリアに入れるか（ログイン済み、かつ必要ならメール確認済み） */
  isResident: boolean;
  /** 自分の住民票。読み込み中・未作成は null */
  profile: UserProfile | null;
  profileLoading: boolean;
  /** 自分でログアウトした直後か（住民限定エリアから /login ではなく公開トップへ戻すため） */
  loggedOut: boolean;
  /** メール確認後などに、最新の状態を取り直す */
  refresh: () => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthState | null>(null);

export function useAuth() {
  const v = useContext(AuthContext);
  if (!v) throw new Error("useAuth は AuthProvider の内側で使ってください");
  return v;
}

function residentOf(user: User | null) {
  return !!user && (!REQUIRE_EMAIL_VERIFICATION || user.emailVerified);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  // emailVerified は User を作り直さないと変化が伝わらないため、別に持つ
  const [isResident, setIsResident] = useState(false);
  const [loggedOut, setLoggedOut] = useState(false);

  useEffect(() => {
    return onAuthStateChanged(firebaseAuth(), (u) => {
      setUser(u);
      if (u) setLoggedOut(false);
      setIsResident(residentOf(u));
      setLoading(false);
    });
  }, []);

  // 住民になったら自分の住民票を購読する（読み取りはルール上、住民のみ）
  const uid = isResident ? user?.uid : undefined;
  const [snap, setSnap] = useState<{ uid: string; profile: UserProfile | null } | null>(null);
  useEffect(() => {
    if (!uid) return;
    return subscribeProfile(
      uid,
      (p) => setSnap({ uid, profile: p }),
      () => setSnap({ uid, profile: null }),
    );
  }, [uid]);
  const profile = uid && snap?.uid === uid ? snap.profile : null;
  const profileLoading = !!uid && snap?.uid !== uid;

  const refresh = async () => {
    const u = firebaseAuth().currentUser;
    if (!u) return;
    await u.reload();
    // メール確認の結果をセキュリティルールに伝えるため、IDトークンを取り直す
    await u.getIdToken(true);
    setUser(firebaseAuth().currentUser);
    setIsResident(residentOf(firebaseAuth().currentUser));
  };

  const logout = async () => {
    setLoggedOut(true);
    await signOut(firebaseAuth());
  };

  return (
    <AuthContext.Provider value={{ loading, user, isResident, profile, profileLoading, loggedOut, refresh, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
