interface OrangeHospitalLogoProps {
  className?: string;
  size?: number;
}

export function OrangeHospitalLogo({ className = 'w-6 h-6', size }: OrangeHospitalLogoProps) {
  const style = size ? { width: size, height: size } : undefined;

  return (
    <svg
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 ${className}`}
      style={style}
      aria-label="Orange Hospital Logo"
    >
      {/* Leaves at the top stem */}
      {/* Left Leaf */}
      <path
        d="M106 38 C94 30 76 20 78 8 C94 6 104 20 108 36 Z"
        fill="#52B848"
      />
      {/* Right Leaf */}
      <path
        d="M109 38 C118 30 130 22 140 22 C140 32 128 40 111 40 Z"
        fill="#52B848"
      />

      {/* Upper Eye Shape with Round Cutout */}
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M44 66 C72 40 138 40 166 72 C138 84 72 84 44 66 Z M105 48 C113.284 48 120 54.7157 120 63 C120 71.2843 113.284 78 105 78 C96.7157 78 90 71.2843 90 63 C90 54.7157 96.7157 48 105 48 Z"
        fill="#EE5816"
      />

      {/* Lower Wedge (Orange Slice) */}
      <path
        d="M38 158 L176 94 C184 130 152 182 108 192 C72 192 46 178 38 158 Z"
        fill="#EE5816"
      />
    </svg>
  );
}

export function PoweredByOrangeHospital({
  theme = 'dark',
  className = '',
}: {
  theme?: 'dark' | 'light';
  className?: string;
}) {
  const isDark = theme === 'dark';

  return (
    <div
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full transition-all ${
        isDark
          ? 'bg-white/10 border border-white/15 text-white/90 shadow-sm backdrop-blur-sm'
          : 'bg-white border border-ink/10 text-ink-soft shadow-sm'
      } ${className}`}
    >
      <div className="w-5 h-5 flex items-center justify-center shrink-0">
        <OrangeHospitalLogo className="w-5 h-5 drop-shadow-sm" />
      </div>
      <span className="text-[11px] font-medium tracking-wide">
        Powered by{' '}
        <span
          className={`font-semibold ${
            isDark ? 'text-amber-200' : 'text-rust'
          }`}
        >
          Orange Hospital
        </span>
      </span>
    </div>
  );
}
