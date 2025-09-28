
import type { SVGProps } from 'react';

export function Logo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 250 50"
      width="180"
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
        y="35"
        fontFamily="'PT Sans', sans-serif"
        fontSize="28"
        fontWeight="bold"
      >
        <tspan fill="url(#logo-gradient)">BahiaBlanca</tspan>
        <tspan fill="hsl(var(--foreground))">Oficios</tspan>
      </text>
    </svg>
  );
}
