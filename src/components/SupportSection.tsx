import { AlertTriangle, Heart } from "lucide-react";
import { useSupportFlow } from "@/components/SupportFlow";
import { WalletCard } from "@/components/WalletCard";

export function SupportSection() {
  const support = useSupportFlow();
  return (
    <section id="support" className="relative mx-auto max-w-4xl scroll-mt-24 px-5 py-16">
      <div className="text-center">
        <p className="text-[11px] tracking-[0.4em] text-gold">طرق الدعم</p>
        <h2 className="mt-3 text-2xl font-extrabold sm:text-3xl">
          اختر <span className="text-gradient-gold">الشبكة المناسبة</span>
        </h2>
      </div>

      <div
        role="note"
        className="surface-card mx-auto mt-8 flex max-w-2xl items-start gap-3 rounded-2xl p-4 text-right"
      >
        <AlertTriangle className="mt-0.5 size-5 shrink-0 text-gold" aria-hidden="true" />
        <p className="text-[13px] leading-relaxed text-muted-foreground">
          تأكد من اختيار الشبكة الصحيحة قبل إرسال الدعم. الإرسال على شبكة مختلفة قد يؤدي إلى فقدان
          المبلغ.
        </p>
      </div>

      <div className="mt-8 grid gap-6 sm:grid-cols-2">
        <div className="reveal" style={{ animationDelay: "120ms" }}>
          <WalletCard
            network="USDT — BEP20"
            hint="شبكة BNB Smart Chain"
            accent="emerald"
            address="0x4e817ab10246f592c00434a4d2147e4f63348951"
          />
        </div>
        <div className="reveal" style={{ animationDelay: "240ms" }}>
          <WalletCard
            network="USDT — APTOS"
            hint="شبكة Aptos"
            accent="cyan"
            address="0x7a3a37ee388044b59cc04eeba56a933f2323da744fa893c01d2c413725a3c3d8"
          />
        </div>
      </div>

      <div className="mt-8 flex justify-center">
        <button
          onClick={() => support.open()}
          className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-primary px-8 text-base font-bold text-primary-foreground shadow-[var(--shadow-gold)] transition-transform hover:scale-[1.02] active:scale-95"
        >
          <Heart className="size-4" aria-hidden="true" />
          ادعم الآن
        </button>
      </div>
    </section>
  );
}
