import { Cpu, MonitorPlay, ShieldCheck } from "lucide-react";

const points = [
  {
    icon: Cpu,
    title: "حاسوب يتحمّل التداول",
    text: "منصات التحليل والرسوم البيانية تحتاج جهازاً ثابتاً لا يتجمّد وقت دخول الصفقة.",
  },
  {
    icon: MonitorPlay,
    title: "محتوى أفضل",
    text: "تسجيل وتحليل الجلسات ومشاركتها معكم بجودة محترمة بدل التوقّف كل مرة.",
  },
  {
    icon: ShieldCheck,
    title: "شفافية كاملة",
    text: "لا أرقام مضخّمة ولا وعود. كل ما أعرضه هنا صادق، وأي تحديث يأتي من واقع فعلي.",
  },
];

export function GoalSection() {
  return (
    <section id="goal" className="relative mx-auto max-w-4xl scroll-mt-24 px-5 py-16">
      <div className="text-center">
        <p className="text-[11px] tracking-[0.4em] text-gold">الهدف</p>
        <h2 className="mt-3 text-2xl font-extrabold sm:text-3xl">
          لماذا أحتاج إلى <span className="text-gradient-gold">هذا الحاسوب</span>
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          أتداول اليوم بإمكانيات محدودة جداً، والجهاز الحالي لا يتحمّل فتح المنصات والتحليل في
          نفس الوقت. الحاسوب المناسب سيمنحني استقراراً في العمل ووقتاً أطول للتعلّم والمشاركة.
        </p>
      </div>

      <div className="mt-10 grid gap-4 sm:grid-cols-3">
        {points.map((p, i) => (
          <div
            key={p.title}
            className="reveal surface-card rounded-3xl p-6"
            style={{ animationDelay: `${120 * i}ms` }}
          >
            <p.icon className="size-6 text-gold" aria-hidden="true" />
            <h3 className="mt-4 text-base font-bold">{p.title}</h3>
            <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">{p.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
