import { useState } from "react";
import { ArrowLeft, VolumeX } from "lucide-react";

export function WelcomeGate({ onEnter }: { onEnter: (withMusic: boolean) => void }) {
  const [closing, setClosing] = useState(false);
  const [hidden, setHidden] = useState(false);

  if (hidden) return null;

  const handle = (withMusic: boolean) => {
    onEnter(withMusic);
    setClosing(true);
    window.setTimeout(() => setHidden(true), 500);
  };

  return (
    <div
      dir="rtl"
      role="dialog"
      aria-modal="true"
      aria-label="شاشة الترحيب"
      className={`fixed inset-0 z-[100] grid place-items-center bg-background/95 backdrop-blur-xl transition-opacity duration-500 ${
        closing ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
    >
      <div className="veil pointer-events-none absolute inset-0" />

      <div className="relative mx-5 w-full max-w-md text-center">
        <div className="halo absolute inset-0 -z-10 rounded-full bg-gold/20 blur-3xl" />

        <img
          src="/assets/legend-logo.png"
          alt="شعار LEGEND"
          className="emblem-reveal mx-auto size-24 object-contain"
        />

        <p className="reveal mt-5 text-[11px] tracking-[0.5em] text-gold" style={{ animationDelay: "120ms" }}>
          L E G E N D
        </p>

        <h1 className="reveal mt-4 text-3xl font-extrabold sm:text-4xl" style={{ animationDelay: "240ms" }}>
          <span className="text-gradient-gold">السلام عليكم</span>
        </h1>

        <p className="reveal mt-3 text-sm text-muted-foreground" style={{ animationDelay: "340ms" }}>
          مرحباً بك — تفضّل بالدخول إلى صفحة الدعم
        </p>

        <div className="reveal mt-8 flex flex-col items-center gap-3" style={{ animationDelay: "440ms" }}>
          <button
            onClick={() => handle(true)}
            className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-primary px-8 text-base font-bold text-primary-foreground shadow-[var(--shadow-gold)] transition-transform hover:scale-[1.02] active:scale-95"
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
            ادخل إلى صفحة الدعم
          </button>

          <button
            onClick={() => handle(false)}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-6 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <VolumeX className="size-4" aria-hidden="true" />
            الدخول بدون موسيقى
          </button>
        </div>
      </div>
    </div>
  );
}
