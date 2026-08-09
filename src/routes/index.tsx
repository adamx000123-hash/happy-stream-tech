import { createFileRoute } from "@tanstack/react-router";
import { Heart, ShieldCheck, Sparkles, TrendingUp } from "lucide-react";
import logo from "@/assets/legend-logo.jpeg.asset.json";
import { WalletCard } from "@/components/WalletCard";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "LEGEND — ادعم حلم شاشة التداول" },
      {
        name: "description",
        content:
          "شارك في رحلة LEGEND نحو التداول الاحترافي. كل مساهمة بـ USDT تقرّبني من الحاسوب الذي سيحوّل الشغف إلى نتائج.",
      },
      { property: "og:title", content: "LEGEND — ادعم حلم شاشة التداول" },
      {
        property: "og:description",
        content: "ساهم بأي مبلغ عبر USDT (BEP20 / APTOS) وكن جزءاً من القصة.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const perks = [
  {
    icon: Sparkles,
    title: "اسمك في القصة",
    text: "كل داعم يصبح جزءاً من رحلة LEGEND، ويُذكر في محتوى الشكر القادم.",
  },
  {
    icon: TrendingUp,
    title: "شفافية كاملة",
    text: "ستشاهد بعينك التقدّم: الشاشات، الإعدادات، وأول جلسة تداول على الجهاز الجديد.",
  },
  {
    icon: ShieldCheck,
    title: "معرفة مجانية",
    text: "كل ما أتعلّمه في الفوريكس أعيده لكم تحليلات ودروساً مباشرة، بدون مقابل.",
  },
];

function Index() {
  return (
    <main dir="rtl" className="relative min-h-screen overflow-hidden bg-background">
      <div className="veil pointer-events-none absolute inset-x-0 top-0 h-[70vh]" />

      <section className="relative mx-auto max-w-3xl px-5 pt-16 pb-14 text-center sm:pt-24">
        <img
          src={logo.url}
          alt="شعار LEGEND"
          className="mx-auto size-32 rounded-full bg-foreground object-contain p-2 sm:size-40"
        />
        <p className="mt-8 text-xs tracking-[0.4em] text-gold">L E G E N D</p>
        <h1 className="mt-4 text-4xl leading-tight font-extrabold sm:text-6xl">
          <span className="text-gradient-gold">حلم واحد</span> وشاشة تداول واحدة
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
          أتداول الفوريكس بشغف منذ سنوات، لكن أدواتي الحالية تخنق التنفيذ. هدفي حاسوب قادر على تشغيل
          التحليل والتنفيذ في نفس اللحظة. أنت لا ترسل مالاً في الفراغ — أنت تشتري مقعداً في الصف
          الأول من هذه الرحلة.
        </p>
        <a
          href="#support"
          className="mt-9 inline-flex items-center gap-2 rounded-full bg-primary px-8 py-4 text-sm font-bold text-primary-foreground transition-transform hover:scale-105"
        >
          <Heart className="size-4" />
          ادعم الآن
        </a>
        <p className="mt-4 text-xs text-muted-foreground">حتى سنت واحد عندي فرق كبير ❤️</p>
      </section>

      <section className="relative mx-auto max-w-4xl px-5 py-10">
        <div className="grid gap-4 sm:grid-cols-3">
          {perks.map((p) => (
            <div key={p.title} className="surface-card rounded-3xl p-6 text-right">
              <p.icon className="size-6 text-gold" />
              <h2 className="mt-4 text-base font-bold">{p.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{p.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="support" className="relative mx-auto max-w-4xl px-5 py-12">
        <h2 className="text-center text-2xl font-extrabold sm:text-3xl">
          اختر <span className="text-gradient-gold">الشبكة</span> وأرسل ما تيسّر
        </h2>
        <p className="mt-3 text-center text-sm text-muted-foreground">
          الإرسال يستغرق أقل من دقيقة — انسخ العنوان أو امسح رمز QR من محفظتك.
        </p>

        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          <WalletCard
            network="USDT — BSC (BEP20)"
            hint="رسوم منخفضة جداً وسرعة عالية"
            address="0x4e817ab10246f592c00434a4d2147e4f63348951"
          />
          <WalletCard
            network="USDT — APTOS"
            hint="تأكيد شبه فوري بتأكيدة واحدة"
            address="0x7a3a37ee388044b59cc04eeba56a933f2323da744fa893c01d2c413725a3c3d8"
          />
        </div>

        <p className="mt-8 text-center text-xs leading-relaxed text-muted-foreground">
          تأكد من اختيار الشبكة الصحيحة قبل الإرسال. الإرسال على شبكة خاطئة قد يؤدي إلى ضياع
          الأموال.
        </p>
      </section>

      <footer className="relative border-t border-border px-5 py-10 text-center">
        <p className="text-sm text-muted-foreground">
          شكراً لكل من وقف معي. الطريق طويل، لكن الأسود لا تمشي وحدها.
        </p>
        <p className="mt-3 text-xs tracking-[0.35em] text-gold">LEGEND</p>
      </footer>
    </main>
  );
}
