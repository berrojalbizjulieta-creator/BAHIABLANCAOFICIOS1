import type { SVGProps } from 'react';
import Image from 'next/image';

export function Logo(props: any) {
  return (
    <div className="flex items-center gap-2">
       <svg
        width="32"
        height="32"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="text-primary"
      >
        <path
          d="M22 10a1.999 1.999 0 0 0-2-2h-4.34A5.001 5.001 0 0 0 9 2.66V2a1 1 0 1 0-2 0v.66A5.001 5.001_0 0 0 .34 8H4a2 2 0 0 0 2-2c0-.55.45-1 1-1s1 .45 1 1c0 1.1-.9 2-2 2H2c0 1.65 1.35 3 3 3h1.34A5.001 5.001 0 0 0 15 15.34V22a1 1 0 1 0 2 0v-6.66A5.001 5.001 0 0 0 22 10z"
          fill="currentColor"
        />
      </svg>
      <div className="text-xl font-bold font-headline">
        <span className="text-primary">BahiaBlanca</span>
        <span className="text-foreground">Oficios</span>
      </div>
    </div>
  );
}
