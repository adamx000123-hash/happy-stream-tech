import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    q: "ما الهدف من الدعم؟",
    a: "جمع ما يكفي لشراء حاسوب مناسب للتداول وصناعة محتوى أفضل وأكثر انتظاماً.",
  },
  {
    q: "ما الشبكات المتاحة؟",
    a: "USDT على شبكة BNB Smart Chain (BEP20)، و USDT على شبكة Aptos.",
  },
  {
    q: "كيف أتأكد من اختيار الشبكة الصحيحة؟",
    a: "قبل الإرسال، اختر في محفظتك نفس الشبكة المكتوبة على البطاقة، وقارن أول وآخر أربعة رموز من العنوان. الإرسال على شبكة خاطئة قد يؤدي إلى ضياع المبلغ.",
  },
  {
    q: "هل يمكنني إرسال رسالة دون نشر اسمي؟",
    a: "نعم. استعمل اسماً مستعاراً، أو لا تفعّل خيار الموافقة على النشر وستبقى رسالتك خاصة بيني وبينك.",
  },
  {
    q: "هل تُنشر التعليقات مباشرة؟",
    a: "لا. كل رسالة تبقى «قيد المراجعة» ولا تظهر في الموقع إلا بعد مراجعتها يدوياً.",
  },
  {
    q: "هل يمكن حذف رسالتي بعد نشرها؟",
    a: "نعم، أرسل طلباً بنفس الاسم الذي استعملته وسيتم حذف الرسالة.",
  },
];

export function FaqSection() {
  return (
    <section id="faq" className="relative mx-auto max-w-3xl scroll-mt-24 px-5 py-16">
      <h2 className="text-center text-2xl font-extrabold sm:text-3xl">
        <span className="text-gradient-gold">الأسئلة الشائعة</span>
      </h2>

      <Accordion type="single" collapsible className="mt-8 space-y-3">
        {faqs.map((f, i) => (
          <AccordionItem
            key={f.q}
            value={`item-${i}`}
            className="surface-card overflow-hidden rounded-2xl border-none px-4"
          >
            <AccordionTrigger className="py-4 text-right text-sm font-bold hover:no-underline sm:text-base">
              {f.q}
            </AccordionTrigger>
            <AccordionContent className="pb-4 text-sm leading-relaxed text-muted-foreground">
              {f.a}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}
