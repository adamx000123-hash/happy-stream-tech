import { useQuery } from "@tanstack/react-query";
import { BadgeCheck, MessageSquareHeart } from "lucide-react";
import { fetchPublicMessages, initials, shortDate } from "@/lib/supporters";

function MessageCard({
  name,
  text,
  date,
  verified,
}: {
  name: string;
  text: string;
  date: string;
  verified: boolean;
}) {
  return (
    <article className="surface-card flex min-w-[80%] snap-start flex-col rounded-3xl p-5 sm:min-w-0">
      <div className="flex items-center gap-3">
        <span className="grid size-11 shrink-0 place-items-center rounded-full bg-gradient-to-br from-[oklch(0.68_0.11_70)] to-[oklch(0.9_0.09_92)] text-base font-black text-background">
          {initials(name)}
        </span>
        <div className="min-w-0">
          <p className="flex items-center gap-1.5 truncate text-sm font-bold">
            {name}
            {verified && (
              <span className="inline-flex items-center gap-1 rounded-full bg-secondary/80 px-2 py-0.5 text-[10px] font-bold text-gold">
                <BadgeCheck className="size-3" aria-hidden="true" />
                داعم موثّق
              </span>
            )}
          </p>
          <p className="text-[11px] text-muted-foreground">{date}</p>
        </div>
      </div>
      <p className="mt-4 text-[13px] leading-relaxed text-muted-foreground">{text}</p>
    </article>
  );
}

export function MessagesSection() {
  const { data: messages = [], isLoading } = useQuery({
    queryKey: ["public-messages"],
    queryFn: fetchPublicMessages,
  });

  return (
    <section id="community" className="relative mx-auto max-w-5xl scroll-mt-24 px-5 pb-16">
      {isLoading ? (
        <p className="text-center text-sm text-muted-foreground">جارٍ التحميل…</p>
      ) : messages.length === 0 ? (
        <div className="surface-card mx-auto max-w-xl rounded-3xl p-8 text-center">
          <MessageSquareHeart className="mx-auto size-7 text-gold" aria-hidden="true" />
          <p className="mt-3 text-sm text-muted-foreground">
            لا توجد تعليقات بعد — يمكن أن يكون تعليقك الأول.
          </p>
        </div>
      ) : (
        <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4 sm:grid sm:grid-cols-2 sm:overflow-visible lg:grid-cols-3">
          {messages.map((m) => (
            <MessageCard
              key={m.id}
              name={m.display_name}
              text={m.message}
              date={shortDate(m.created_at)}
              verified={m.is_verified_supporter}
            />
          ))}
        </div>
      )}
    </section>
  );
}
