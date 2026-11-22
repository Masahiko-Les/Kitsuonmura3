// 水彩画風の村のイラスト（docs/prototype.html の village() を移植）
// animated=true でオープニング用のアニメーション（村が建つ → 船が港に着く → 旅人が上陸 → 住民が迎える）。
// 静止画として使うとき（ホーム・公開トップ）は animated を省略する。
import type { CSSProperties } from "react";
import styles from "./VillageIllustration.module.css";

type House = [x: number, y: number, w: number, h: number, roof: string, delay: number];

const HOUSES: House[] = [
  [100, 168, 22, 16, "#8C6B4F", 0.1],
  [127, 169, 18, 14, "#5E7F6A", 0.4],
  [150, 167, 24, 19, "#A0674E", 0.7],
  [180, 170, 18, 13, "#5E7F6A", 1.0],
  [62, 171, 20, 14, "#A0674E", 1.3],
  [206, 171, 20, 14, "#8C6B4F", 1.6],
];

const FOLK: [x: number, color: string][] = [
  [232, "#A0674E"],
  [241, "#8C6B4F"],
  [250, "#5E7F6A"],
];

type Props = {
  animated?: boolean;
  /** 同じページに複数置くときに SVG の id が衝突しないようにするための接頭辞 */
  idPrefix?: string;
};

export function VillageIllustration({ animated = false, idPrefix = "village" }: Props) {
  const id = (name: string) => `${idPrefix}-${name}`;
  const url = (name: string) => `url(#${id(name)})`;

  return (
    <div className={`hero ${animated ? styles.anim : ""}`}>
      <svg viewBox="0 0 400 240" role="img" aria-label="海辺の小さな村と、港へ向かう一艘の船の水彩画風イラスト">
        <defs>
          <filter id={id("wc")} x="-5%" y="-5%" width="110%" height="110%">
            <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves={2} seed={4} />
            <feDisplacementMap in="SourceGraphic" scale={5} />
          </filter>
          <filter id={id("soft")}>
            <feGaussianBlur stdDeviation={2} />
          </filter>
          <linearGradient id={id("sky")} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#F5F0E4" />
            <stop offset="1" stopColor="#E2ECE8" />
          </linearGradient>
          <linearGradient id={id("sea")} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#9DBEC0" />
            <stop offset="1" stopColor="#CFE0DB" />
          </linearGradient>
        </defs>
        <rect width="400" height="240" fill={url("sky")} />
        <circle cx="322" cy="56" r="26" fill="#F2D6A2" opacity=".6" filter={url("soft")} />
        <g filter={url("wc")}>
          <path d="M0 140 L60 84 L112 118 L172 64 L240 126 L302 94 L400 138 L400 170 L0 170Z" fill="#AEC6B2" opacity=".8" />
          <path d="M0 152 L50 118 L120 146 L192 108 L262 152 L262 170 L0 170Z" fill="#84A58F" opacity=".75" />
          <g fill="#4F7A62" opacity=".8">
            <ellipse cx="22" cy="156" rx="16" ry="12" />
            <ellipse cx="44" cy="150" rx="13" ry="13" />
            <ellipse cx="228" cy="156" rx="14" ry="10" />
            <ellipse cx="246" cy="158" rx="10" ry="8" />
          </g>
          <rect y="166" width="400" height="74" fill={url("sea")} />
          <path d="M0 164 Q70 158 140 162 T262 166 L272 178 Q200 192 120 188 T0 190Z" fill="#DDCDAA" />
          <rect x="250" y="172" width="62" height="5" fill="#8C6B4F" />
          <rect x="262" y="177" width="3" height="9" fill="#7A5C42" />
          <rect x="290" y="177" width="3" height="9" fill="#7A5C42" />
          {HOUSES.map(([x, y, w, h, roof, d]) => (
            <g key={`${x}-${y}`} className={styles.house} style={{ "--d": `${d}s` } as CSSProperties}>
              <rect x={x} y={y - h} width={w} height={h} fill="#F1E6D0" stroke="#B59C7C" strokeWidth=".8" />
              <path d={`M${x - 3} ${y - h} L${x + w / 2} ${y - h - h * 0.75} L${x + w + 3} ${y - h}Z`} fill={roof} />
              <rect x={x + w / 2 - 2.5} y={y - h * 0.6} width="5" height="5" fill="#8C6B4F" opacity=".55" />
            </g>
          ))}
        </g>
        <g stroke="#fff" strokeWidth="1.2" opacity=".65" fill="none">
          <path d="M330 204 q10-4 20 0 t20 0" />
          <path d="M290 224 q10-4 20 0 t20 0" />
          <path d="M200 214 q10-4 20 0 t20 0" />
          <path d="M60 222 q10-4 20 0 t20 0" />
        </g>
        <g className={styles.boat}>
          <path d="M300 181 h36 l-7 9 h-23z" fill="#8C6B4F" />
          <path d="M317 180 v-26 l15 24z" fill="#FBF7EE" stroke="#B59C7C" strokeWidth=".8" />
        </g>
        <g className={styles.traveler}>
          <circle cx="300" cy="162" r="2.6" fill="#2F5D4A" />
          <rect x="297.7" y="164.7" width="4.6" height="7.5" rx="2" fill="#2F5D4A" />
        </g>
        <g className={styles.folk}>
          {FOLK.map(([x, c]) => (
            <g key={x}>
              <circle cx={x} cy={165} r="2.4" fill={c} />
              <rect x={x - 2.2} y={167.5} width="4.4" height="7" rx="2" fill={c} />
            </g>
          ))}
        </g>
      </svg>
    </div>
  );
}
