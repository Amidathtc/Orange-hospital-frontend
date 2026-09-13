import { AuthIllustration } from './AuthIllustration';
import { OrangeHospitalLogo, PoweredByOrangeHospital } from './OrangeHospitalLogo';

export function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#FBF7EE]">
      {/* Story panel — rich forest aesthetic on desktop, compact branded banner on mobile */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#1F4D3D] via-[#16382C] to-[#0E241C] text-white px-6 py-8 md:py-14 md:px-12 md:w-[46%] lg:w-[44%] flex flex-col justify-between shrink-0 shadow-2xl">
        {/* Subtle background glow elements */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-rust/15 rounded-full blur-3xl pointer-events-none" />

        {/* Top brand identity */}
        <div className="relative z-10 flex items-center justify-between">
          <a href="/login" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-white p-1 flex items-center justify-center shrink-0 shadow-md shadow-black/20 group-hover:scale-105 transition-transform">
              <OrangeHospitalLogo className="w-8 h-8 drop-shadow-sm" />
            </div>
            <div className="flex flex-col">
              <span className="font-display font-semibold tracking-tight text-base leading-tight">
                Orange Health <span className="text-rust-light font-normal text-amber-200">Ajo</span>
              </span>
              <span className="text-[10px] text-white/60 tracking-wider uppercase font-mono">
                Powered by Orange Hospital
              </span>
            </div>
          </a>

          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium bg-white/10 text-white/80 backdrop-blur-sm border border-white/10">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Ajegunle, Lagos
          </span>
        </div>

        {/* Center illustration & copy (desktop only) */}
        <div className="hidden md:flex flex-col items-start gap-7 my-auto py-8 relative z-10">
          <div className="w-full flex justify-center py-2">
            <AuthIllustration />
          </div>

          <div>
            <div className="inline-flex items-center gap-1.5 mb-3 px-3 py-1 rounded-full text-xs font-medium bg-white/10 border border-white/15 text-paper">
              <OrangeHospitalLogo className="w-3.5 h-3.5" />
              <span>Official Healthcare Savings Partner</span>
            </div>
            <h1 className="font-display text-2xl lg:text-3xl leading-snug font-medium max-w-sm text-paper">
              The community fund Ajegunle already trusts, now digital.
            </h1>
            <p className="text-white/70 text-sm mt-3 max-w-sm leading-relaxed">
              Every stamp on your card is an instant, verified contribution on record. Backed by Orange Hospital medical facilities.
            </p>
          </div>
        </div>

        {/* Bottom meta stats / security badge */}
        <div className="hidden md:flex items-center justify-between border-t border-white/10 pt-5 text-xs text-white/50 relative z-10">
          <PoweredByOrangeHospital theme="dark" />
          <span className="font-mono text-[11px] text-white/40">Ajegunle Care</span>
        </div>
      </div>

      {/* Form panel with elevated card */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 sm:px-8 py-8 md:py-16">
        <div className="w-full max-w-md">
          {children}
        </div>

        {/* Powered by badge below form card */}
        <div className="mt-6 text-center">
          <PoweredByOrangeHospital theme="light" />
        </div>
      </div>
    </div>
  );
}
