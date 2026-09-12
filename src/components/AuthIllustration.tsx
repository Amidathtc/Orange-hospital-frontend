// The passbook-stamp motif, reused from the fund cards — this is what an
// actual ajo contribution record looks like, physically, at Orange Health.
// Not a generic auth-page illustration; it's the real object this app replaces.
export function AuthIllustration() {
  return (
    <svg viewBox="0 0 360 300" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto max-w-[320px]">
      {/* the card / passbook */}
      <rect x="30" y="40" width="260" height="200" rx="16" fill="#FFFDF9" opacity="0.06" />
      <rect x="30" y="40" width="260" height="200" rx="16" stroke="#FFFDF9" strokeOpacity="0.25" strokeWidth="1.5" />

      {/* header line on the card */}
      <rect x="54" y="66" width="120" height="8" rx="4" fill="#FFFDF9" fillOpacity="0.35" />
      <rect x="54" y="82" width="80" height="6" rx="3" fill="#FFFDF9" fillOpacity="0.2" />

      {/* stamp grid — mix of filled (paid), and one pending (dashed) */}
      {[0, 1, 2, 3].map((col) => (
        <circle
          key={`row1-${col}`}
          cx={70 + col * 52}
          cy={130}
          r="18"
          fill={col < 3 ? '#2E6B54' : 'none'}
          stroke="#FFFDF9"
          strokeOpacity={col < 3 ? 0 : 0.4}
          strokeDasharray={col < 3 ? undefined : '3 3'}
          strokeWidth="1.5"
        />
      ))}
      {[0, 1, 2, 3].map((col) => (
        <circle
          key={`row2-${col}`}
          cx={70 + col * 52}
          cy={182}
          r="18"
          fill={col < 2 ? '#B8452D' : 'none'}
          stroke="#FFFDF9"
          strokeOpacity={col < 2 ? 0 : 0.3}
          strokeDasharray={col < 2 ? undefined : '3 3'}
          strokeWidth="1.5"
        />
      ))}

      {/* checkmarks on filled stamps */}
      <path d="M62 130l6 6 12-12" stroke="#FFFDF9" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M114 130l6 6 12-12" stroke="#FFFDF9" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M166 130l6 6 12-12" stroke="#FFFDF9" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M62 182l6 6 12-12" stroke="#FFFDF9" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M114 182l6 6 12-12" stroke="#FFFDF9" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
