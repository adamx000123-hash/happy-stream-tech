import { useState } from "react";
import { Sparkles } from "lucide-react";

export function WelcomeGate({ onEnter }: { onEnter: () => void }) {
  const [closing, setClosing] = useState(false);
  const [hidden, setHidden] = useState(false);

  if (hidden) return null;

  const handle = () => {
    onEnter();
    setClosing(true);
    window.setTimeout(() => setHidden(true), 550);
  };

  return (
    <div
      dir="rtl"
      className={`fixed inset-0 z-[100] grid place-items-center bg-background/95 backdrop-blur-xl transition-opacity duration-500 ${
        closing ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
    >
      <div className="veil pointer-events-none absolute inset-0" />

      <div className="relative mx-5 w-full max-w-md text-center">
        <div className="halo absolute inset-0 -z-10 rounded-full bg-gold/20 blur-3xl" />

        <p
          className="reveal text-[11px] tracking-[0.5em] text-gold"
          style={{ animationDelay: "80ms" }}
        >
          L E G E N D
        </p>

        <h2
          className="reveal mt-5 text-4xl font-extrabold sm:text-5xl"
          style={{ animationDelay: "220ms" }}
        >
          <span className="text-gradient-gold">السلام عليكم</span>
        </h2>

        <p
          className="reveal mt-4 text-sm text-muted-foreground"
          style={{ animationDelay: "360ms" }}
        >
          مرحباً بك — اضغط للدخول وتشغيل الموسيقى
        </p>

        <button
          onClick={handle}
          className="reveal hover-scale mt-8 inline-flex items-center gap-2 rounded-full bg-primary px-8 py-3.5 text-base font-bold text-primary-foreground shadow-[var(--shadow-gold)] active:scale-95"
          style={{ animationDelay: "500ms" }}
        >
          <Sparkles className="size-4" />
          وعليكم السلام
        </button>
      </div>
    </div>
  );
}
