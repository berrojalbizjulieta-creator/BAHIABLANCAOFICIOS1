import type { SVGProps } from 'react';

export function Logo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 200 50"
      width="140"
      height="40"
      {...props}
    >
      <defs>
        <linearGradient id="logo-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style={{ stopColor: 'hsl(var(--primary))' }} />
          <stop offset="100%" style={{ stopColor: 'hsl(var(--accent))' }} />
        </linearGradient>
      </defs>
      <text
        x="0"
        y="40"
        fontFamily="'PT Sans', sans-serif"
        fontSize="38"
        fontWeight="bold"
        fill="url(#logo-gradient)"
      >
        Oficios
        <tspan fill="hsl(var(--foreground))">BB</tspan>
      </text>
    </svg>
  );
}
