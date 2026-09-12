import { AuthIllustration } from './AuthIllustration';

export function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Story panel — full intro on desktop, a compact band on mobile */}
      <div className="bg-forest text-white px-6 py-10 md:py-16 md:px-12 md:w-[44%] flex flex-col justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-rust relative shrink-0">
            <div className="absolute inset-[2.5px] rounded-full border-2 border-forest" />
          </div>
          <span className="font-display font-semibold">Orange Health Ajo</span>
        </div>

        <div className="hidden md:flex flex-col items-start gap-8 my-auto">
          <AuthIllustration />
          <div>
            <h1 className="font-display text-2xl leading-snug font-medium max-w-xs">
              The community fund Ajegunle already trusts, now digital.
            </h1>
            <p className="text-white/60 text-sm mt-3 max-w-xs">
              Every stamp on this card is a real contribution, on record, the moment it happens.
            </p>
          </div>
        </div>

        <p className="hidden md:block text-white/40 text-xs">Ajegunle, Lagos</p>
      </div>

      {/* Form panel */}
      <div className="flex-1 flex items-center justify-center px-6 py-10 md:py-16">
        <div className="w-full max-w-sm">{children}</div>
      </div>
    </div>
  );
}
