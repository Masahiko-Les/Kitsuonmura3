// 試作品の線画アイコン（docs/prototype.html の I）を移植したもの
import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

function Svg({ children, className, ...rest }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
      className={className ? `i ${className}` : "i"}
      {...rest}
    >
      {children}
    </svg>
  );
}

export const HomeIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z" />
  </Svg>
);

export const CardIcon = (p: IconProps) => (
  <Svg {...p}>
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <circle cx="8.5" cy="11" r="2" />
    <path d="M5.5 16c.8-1.6 5.2-1.6 6 0M14 10h4M14 13h4" />
  </Svg>
);

export const TalkIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M4 5h11a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H9l-4 3v-3H4a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2z" />
    <path d="M19 9h1a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2v2l-3-2h-4" />
  </Svg>
);

export const BookIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M3 5h6a3 3 0 0 1 3 2 3 3 0 0 1 3-2h6v14h-6a3 3 0 0 0-3 2 3 3 0 0 0-3-2H3z" />
    <path d="M12 7v14" />
  </Svg>
);

export const MeIcon = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="12" cy="8" r="4" />
    <path d="M4 21c1-4 4-6 8-6s7 2 8 6" />
  </Svg>
);

export const BackIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M15 5l-7 7 7 7" />
  </Svg>
);

export const LeafIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M12 21v-8" />
    <path d="M12 13c0-4.5 3-7.5 8-7.5 0 5-3.2 8.2-8 7.5z" />
    <path d="M12 15.5c0-3.2-2.2-5.5-6.5-5.5 0 4 2.3 6.2 6.5 5.5z" />
  </Svg>
);

export const ChevIcon = (p: IconProps) => (
  <Svg width={18} height={18} {...p}>
    <path d="M9 5l7 7-7 7" />
  </Svg>
);

export const MapIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M9 4L3 6v14l6-2 6 2 6-2V4l-6 2z" />
    <path d="M9 4v14M15 6v14" />
  </Svg>
);
