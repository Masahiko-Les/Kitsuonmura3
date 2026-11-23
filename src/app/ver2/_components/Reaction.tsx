"use client";

// 共感ボタン（デモ）。件数は出さず、押したことを本人にだけ示す（仕様書 §6）。
// デモなので保存はされず、ページを開き直すと元に戻る。
import { useState } from "react";
import s from "../ver2.module.css";

export function Reaction() {
  const [on, setOn] = useState(false);
  return (
    <button type="button" className={on ? s.reactOn : s.react} aria-pressed={on} onClick={() => setOn(!on)}>
      <svg viewBox="0 0 24 24" aria-hidden="true" fill={on ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.6">
        <path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z" />
      </svg>
      {on ? "届きました" : "あなたの言葉が届きました"}
    </button>
  );
}
