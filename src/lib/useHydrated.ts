"use client";

// ブラウザ側のプログラムが動き始めたら true。サーバーで描いた HTML の段階では false。
// 読み込み途中にフォームを送るとブラウザ標準の送信になり、入力値が URL に載ってしまうため、それまでボタンを押せなくする。
import { useSyncExternalStore } from "react";

const noop = () => () => {};

export function useHydrated() {
  return useSyncExternalStore(
    noop,
    () => true,
    () => false,
  );
}
