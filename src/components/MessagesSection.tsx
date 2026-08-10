import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { BadgeCheck, Loader2, MessageSquareHeart, Send } from "lucide-react";
import { toast } from "sonner";
import {
  fetchPublicMessages,
  initials,
  messageSchema,
  shortDate,
  submitMessage,
  type MessageInput,
} from "@/lib/supporters";

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

const emptyForm: MessageInput = {
  display_name: "",
  message: "",
  tx_reference: "",
  consent_publish: false,
  wants_verified: false,
};

export function MessagesSection() {
  const qc = useQueryClient();
  const [form, setForm] = useState<MessageInput>(emptyForm);
  const [honey, setHoney] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [done, setDone] = useState(false);

  const { data: messages = [], isLoading } = useQuery({
    queryKey: ["public-messages"],
    queryFn: fetchPublicMessages,
  });

  const mutation = useMutation({
    mutationFn: submitMessage,
    onSuccess: () => {
      setForm(emptyForm);
      setErrors({});
      setDone(true);
      toast.success("شكراً لك، وصلت رسالتك وستتم مراجعتها قبل نشرها");
      qc.invalidateQueries({ queryKey: ["public-messages"] });
    },
    onError: () => toast.error("تعذّر إرسال الرسالة، حاول مرة أخرى"),
  });

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (honey) return; // فخ للرسائل المزعجة
    const parsed = messageSchema.safeParse(form);
    if (!parsed.success) {
      const next: Record<string, string> = {};
      for (const issue of parsed.error.issues) next[String(issue.path[0])] = issue.message;
      setErrors(next);
      return;
    }
    setErrors({});
    mutation.mutate(parsed.data);
  };

  return (
    <section id="community" className="relative mx-auto max-w-5xl scroll-mt-24 px-5 py-16">
      <div className="text-center">
        <p className="text-[11px] tracking-[0.4em] text-gold">المجتمع</p>
        <h2 className="mt-3 text-2xl font-extrabold sm:text-3xl">
          <span className="text-gradient-gold">رسائل الداعمين</span>
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-sm text-muted-foreground">
          كل رسالة تُراجَع يدوياً قبل نشرها، ولا يظهر منها إلا ما وافق صاحبه على نشره.
        </p>
      </div>

      {isLoading ? (
        <p className="mt-10 text-center text-sm text-muted-foreground">جارٍ التحميل…</p>
      ) : messages.length === 0 ? (
        <div className="surface-card mx-auto mt-10 max-w-xl rounded-3xl p-8 text-center">
          <MessageSquareHeart className="mx-auto size-7 text-gold" aria-hidden="true" />
          <p className="mt-3 text-sm text-muted-foreground">
            لا توجد رسائل منشورة بعد — يمكن أن تكون رسالتك الأولى.
          </p>
        </div>
      ) : (
        <div className="mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4 sm:grid sm:grid-cols-2 sm:overflow-visible lg:grid-cols-3">
          {messages.map((m, i) => (
            <div key={m.id} className="reveal contents sm:block" style={{ animationDelay: `${80 * i}ms` }}>
              <MessageCard
                name={m.display_name}
                text={m.message}
                date={shortDate(m.created_at)}
                verified={m.is_verified_supporter}
              />
            </div>
          ))}
        </div>
      )}

      <form
        onSubmit={onSubmit}
        className="surface-card mx-auto mt-12 max-w-2xl rounded-3xl p-6 sm:p-8"
        noValidate
      >
        <h3 className="text-lg font-bold">اترك رسالتك</h3>
        <p className="mt-1 text-xs text-muted-foreground">
          لا تشارك أبداً مفاتيح خاصة أو عبارات استرداد أو كلمات مرور.
        </p>

        <input
          type="text"
          value={honey}
          onChange={(e) => setHoney(e.target.value)}
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          className="hidden"
        />

        <div className="mt-6 space-y-5">
          <div>
            <label htmlFor="name" className="text-sm font-bold">
              الاسم أو الاسم المستعار
            </label>
            <input
              id="name"
              value={form.display_name}
              maxLength={40}
              onChange={(e) => setForm({ ...form, display_name: e.target.value })}
              className="mt-2 min-h-12 w-full rounded-2xl bg-secondary/70 px-4 text-sm outline-none ring-ring focus-visible:ring-2"
              placeholder="مثلاً: كريم"
            />
            {errors["display_name"] && (
              <p className="mt-2 text-xs text-destructive">{errors["display_name"]}</p>
            )}
          </div>

          <div>
            <label htmlFor="msg" className="text-sm font-bold">
              نص الرسالة
            </label>
            <textarea
              id="msg"
              value={form.message}
              maxLength={400}
              rows={4}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              className="mt-2 w-full resize-none rounded-2xl bg-secondary/70 p-4 text-sm leading-relaxed outline-none ring-ring focus-visible:ring-2"
              placeholder="اكتب كلمة طيبة…"
            />
            <p className="mt-1 text-left text-[11px] text-muted-foreground">
              {form.message.length}/400
            </p>
            {errors["message"] && <p className="text-xs text-destructive">{errors["message"]}</p>}
          </div>

          <div>
            <label htmlFor="tx" className="text-sm font-bold">
              معرّف المعاملة (اختياري)
            </label>
            <input
              id="tx"
              dir="ltr"
              value={form.tx_reference}
              maxLength={120}
              onChange={(e) => setForm({ ...form, tx_reference: e.target.value })}
              className="mt-2 min-h-12 w-full rounded-2xl bg-secondary/70 px-4 text-left font-mono text-xs outline-none ring-ring focus-visible:ring-2"
              placeholder="0x…"
            />
            <p className="mt-1 text-[11px] text-muted-foreground">
              يُستعمل للتحقق فقط ولا يُعرض للعامة.
            </p>
          </div>

          <label className="flex min-h-11 cursor-pointer items-center gap-3 text-sm">
            <input
              type="checkbox"
              checked={form.consent_publish}
              onChange={(e) => setForm({ ...form, consent_publish: e.target.checked })}
              className="size-5 accent-[var(--gold)]"
            />
            أوافق على نشر رسالتي في الموقع
          </label>

          <label className="flex min-h-11 cursor-pointer items-center gap-3 text-sm">
            <input
              type="checkbox"
              checked={form.wants_verified}
              onChange={(e) => setForm({ ...form, wants_verified: e.target.checked })}
              className="size-5 accent-[var(--gold)]"
            />
            أرغب في الظهور كداعم موثّق
          </label>
        </div>

        <button
          type="submit"
          disabled={mutation.isPending}
          className="mt-6 flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl bg-primary px-4 text-sm font-bold text-primary-foreground transition-transform hover:scale-[1.01] active:scale-[0.99] disabled:opacity-60"
        >
          {mutation.isPending ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <Send className="size-4" />
          )}
          إرسال الرسالة
        </button>

        {done && (
          <p
            role="status"
            className="mt-4 rounded-2xl bg-secondary/70 p-4 text-center text-sm text-gold"
          >
            شكراً لك، وصلت رسالتك وستتم مراجعتها قبل نشرها.
          </p>
        )}
      </form>
    </section>
  );
}
