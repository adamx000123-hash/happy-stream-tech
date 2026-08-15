import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Heart, MessagesSquare } from "lucide-react";
import { MusicPlayer } from "@/components/MusicPlayer";
import { WelcomeGate } from "@/components/WelcomeGate";
import { SiteNav, scrollToSection } from "@/components/SiteNav";
import { GoalSection } from "@/components/GoalSection";
import { SupportSection } from "@/components/SupportSection";
import { MessagesSection } from "@/components/MessagesSection";
import { GratitudeSection } from "@/components/GratitudeSection";
import { FaqSection } from "@/components/FaqSection";
import { SupportFlowProvider, useSupportFlow } from "@/components/SupportFlow";

const title = "ادعم هدف LEGEND — كل دعم يصنع فرقًا";
const description =
  "ساعدني على بناء محطة تداول أفضل، واختر شبكة الإرسال المناسبة بسهولة وأمان — USDT عبر BEP20 أو Aptos.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://happy-stream-tech.lovable.app/" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
    ],
    links: [{ rel: "canonical", href: "https://happy-stream-tech.lovable.app/" }],
  }),
  component: Index,
});

function Index() {
  return (
    <SupportFlowProvider>
      <IndexContent />
    </SupportFlowProvider>
  );
}

function IndexContent() {
  const support = useSupportFlow();
  const [entered, setEntered] = useState(false);

  return (
    <div dir="rtl" className="relative min-h-dvh overflow-hidden bg-background">
      <WelcomeGate onEnter={(withMusic) => setEntered(withMusic)} />
      <SiteNav />

      <div className="veil pointer-events-none absolute inset-x-0 top-0 h-[80vh]" />
      <div className="grid-glow pointer-events-none absolute inset-0 opacity-[0.16]" />

      <main>
        <section
          id="hero"
          className="relative mx-auto max-w-3xl scroll-mt-24 px-5 pt-28 pb-10 text-center sm:pt-32"
        >
          <div className="emblem-reveal relative mx-auto w-fit">
            <div className="halo absolute inset-0 -z-10 rounded-full bg-gold/25 blur-3xl" />
            <img
              src="/assets/legend-logo.png"
              alt="شعار LEGEND"
              width={224}
              height={224}
              className="float-soft mx-auto size-32 object-contain drop-shadow-[0_0_28px_color-mix(in_oklab,var(--gold)_35%,transparent)] sm:size-44"
            />
          </div>

          <p className="reveal mt-6 text-[11px] tracking-[0.5em] text-gold" style={{ animationDelay: "180ms" }}>
            L E G E N D
          </p>

          <h1
            className="reveal mt-4 text-3xl leading-tight font-extrabold sm:text-5xl"
            style={{ animationDelay: "280ms" }}
          >
            ساعدني على بناء <span className="text-gradient-gold">محطة التداول</span> الخاصة بي
          </h1>

          <p
            className="reveal mx-auto mt-5 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base"
            style={{ animationDelay: "380ms" }}
          >
            دعمك يساعدني على شراء حاسوب أفضل للتداول وصناعة محتوى أكثر جودة. كل دعم يتم بإرادتك
            ويصنع فرقاً حقيقياً.
          </p>

          <div className="reveal mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row" style={{ animationDelay: "480ms" }}>
            <button
              onClick={() => support.open()}
              className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-primary px-8 text-base font-bold text-primary-foreground shadow-[var(--shadow-gold)] transition-transform hover:scale-[1.02] active:scale-95 sm:w-auto"
            >
              <Heart className="size-4" aria-hidden="true" />
              ادعم الآن
            </button>
            <button
              onClick={() => scrollToSection("goal")}
              className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full border border-border bg-secondary/60 px-8 text-base font-bold text-foreground transition-transform hover:scale-[1.02] active:scale-95 sm:w-auto"
            >
              <MessagesSquare className="size-4" aria-hidden="true" />
              اقرأ عن الهدف
            </button>
          </div>
        </section>

        <GoalSection />
        <SupportSection />
        <MessagesSection />
        <GratitudeSection />
        <FaqSection />
      </main>

      <footer className="relative border-t border-border px-5 py-10 text-center">
        <p className="text-sm text-muted-foreground">حتى سنت واحد عندي فرق كبير ❤️</p>
        <p className="mt-3 text-xs tracking-[0.35em] text-gold">LEGEND</p>
      </footer>

      <MusicPlayer started={entered} />
    </div>
  );
}
