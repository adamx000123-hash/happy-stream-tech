import { useQuery } from "@tanstack/react-query";
import { Heart } from "lucide-react";
import { fetchVerifiedCount } from "@/lib/supporters";

export function GratitudeSection() {
  const { data: count } = useQuery({
    queryKey: ["verified-count"],
    queryFn: fetchVerifiedCount,
  });

  return (
    <section className="relative mx-auto max-w-3xl px-5 py-16">
      <div className="surface-card relative overflow-hidden rounded-3xl p-8 text-center sm:p-12">
        <div className="halo pointer-events-none absolute -top-24 left-1/2 size-64 -translate-x-1/2 rounded-full bg-gold/15 blur-3xl" />
        <Heart className="relative mx-auto size-7 text-gold" aria-hidden="true" />
        <h2 className="relative mt-4 text-2xl font-extrabold sm:text-3xl">
          <span className="text-gradient-gold">كل دعم يصنع فرقاً</span>
        </h2>
        <p className="relative mx-auto mt-4 max-w-xl text-sm leading-loose text-muted-foreground">
          سواء كان دعمك كبيراً أو بسيطاً، فهو يعني لي الكثير ويقرّبني خطوة من تحقيق هدفي. شكراً لكل
          شخص آمن بما أقدمه وقرر أن يقف بجانبي.
        </p>

        {typeof count === "number" && count > 0 && (
          <p className="relative mt-6 inline-flex items-center gap-2 rounded-full bg-secondary/70 px-4 py-2 text-xs text-muted-foreground">
            <span className="text-base font-black text-gold">{count}</span>
            داعم موثّق حتى الآن
          </p>
        )}
      </div>
    </section>
  );
}
