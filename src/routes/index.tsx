import { createFileRoute } from "@tanstack/react-router";
import logo from "@/assets/legend-logo.png.asset.json";
import { WalletCard } from "@/components/WalletCard";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "LEGEND — ادعم شراء حاسوب التداول" },
      {
        name: "description",
        content: "ادعم LEGEND لشراء حاسوب مناسب لتداول الفوريكس عبر USDT على شبكتي BEP20 و APTOS.",
      },
      { property: "og:title", content: "LEGEND — ادعم شراء حاسوب التداول" },
      {
        property: "og:description",
        content: "ادعم LEGEND لشراء حاسوب التداول عبر USDT (BEP20 / APTOS).",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <main dir="rtl" className="relative min-h-screen overflow-hidden bg-background">
      <div className="veil pointer-events-none absolute inset-x-0 top-0 h-[80vh]" />
      <div className="grid-glow pointer-events-none absolute inset-0 opacity-[0.18]" />

      <section className="relative mx-auto max-w-3xl px-5 pt-16 pb-8 text-center sm:pt-24">
        <div className="relative mx-auto w-fit">
          <div className="absolute inset-0 -z-10 rounded-full bg-gold/25 blur-3xl" />
          <img
            src={logo.url}
            alt="شعار LEGEND"
            className="mx-auto size-40 object-contain drop-shadow-[0_0_28px_color-mix(in_oklab,var(--gold)_35%,transparent)] sm:size-56"
          />
        </div>

        <p className="mt-8 text-[11px] tracking-[0.5em] text-gold">L E G E N D</p>
        <h1 className="mt-4 text-3xl leading-tight font-extrabold sm:text-5xl">
          ادعمني لشراء <span className="text-gradient-gold">حاسوب التداول</span>
        </h1>
      </section>

      <section id="support" className="relative mx-auto max-w-4xl px-5 pt-4 pb-14">
        <div className="grid gap-6 sm:grid-cols-2">
          <WalletCard
            network="USDT — BEP20"
            hint="شبكة BNB Smart Chain"
            accent="emerald"
            address="0x4e817ab10246f592c00434a4d2147e4f63348951"
          />
          <WalletCard
            network="USDT — APTOS"
            hint="شبكة Aptos"
            accent="cyan"
            address="0x7a3a37ee388044b59cc04eeba56a933f2323da744fa893c01d2c413725a3c3d8"
          />
        </div>

        <p className="mt-8 text-center text-xs text-muted-foreground">
          تأكد من اختيار الشبكة الصحيحة قبل الإرسال.
        </p>
      </section>

      <footer className="relative border-t border-border px-5 py-10 text-center">
        <p className="text-sm text-muted-foreground">حتى سنت واحد عندي فرق كبير ❤️</p>
        <p className="mt-3 text-xs tracking-[0.35em] text-gold">LEGEND</p>
      </footer>
    </main>
  );
}
