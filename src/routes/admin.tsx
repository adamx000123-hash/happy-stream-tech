import { useEffect, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { BadgeCheck, Check, LogOut, Pin, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { shortDate, type AdminMessage } from "@/lib/supporters";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "لوحة المراجعة — LEGEND" },
      { name: "description", content: "لوحة خاصة بصاحب موقع LEGEND لمراجعة رسائل الداعمين ونشرها." },
      { property: "og:title", content: "لوحة المراجعة — LEGEND" },
      { property: "og:description", content: "مراجعة رسائل الداعمين ونشرها." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
    links: [{ rel: "canonical", href: "https://happy-stream-tech.lovable.app/admin" }],
  }),
  component: AdminPage,
});

function AdminPage() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [ready, setReady] = useState(false);
  const [draft, setDraft] = useState<Record<string, string>>({});

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) navigate({ to: "/auth" });
      else setReady(true);
    });
  }, [navigate]);

  const { data: messages, isLoading, error } = useQuery({
    queryKey: ["admin-messages"],
    enabled: ready,
    queryFn: async () => {
      const { data, error: err } = await supabase
        .from("supporter_messages")
        .select("*")
        .order("is_pinned", { ascending: false })
        .order("created_at", { ascending: false });
      if (err) throw err;
      return (data ?? []) as AdminMessage[];
    },
  });

  const update = useMutation({
    mutationFn: async ({ id, patch }: { id: string; patch: Partial<AdminMessage> }) => {
      const { error: err } = await supabase.from("supporter_messages").update(patch).eq("id", id);
      if (err) throw err;
    },
    onSuccess: () => {
      toast.success("تم الحفظ");
      qc.invalidateQueries({ queryKey: ["admin-messages"] });
    },
    onError: () => toast.error("تعذّر الحفظ — تأكد أن حسابك مدير"),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error: err } = await supabase.from("supporter_messages").delete().eq("id", id);
      if (err) throw err;
    },
    onSuccess: () => {
      toast.success("تم الحذف");
      qc.invalidateQueries({ queryKey: ["admin-messages"] });
    },
    onError: () => toast.error("تعذّر الحذف"),
  });

  if (!ready) return null;

  return (
    <main dir="rtl" className="min-h-dvh bg-background px-4 py-8">
      <div className="mx-auto max-w-3xl">
        <header className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4">
          <h1 className="truncate text-xl font-extrabold text-gradient-gold">لوحة المراجعة</h1>
          <button
            onClick={async () => {
              await supabase.auth.signOut();
              navigate({ to: "/auth" });
            }}
            className="inline-flex min-h-11 shrink-0 items-center gap-2 rounded-full bg-secondary/80 px-4 text-sm"
          >
            <LogOut className="size-4" />
            خروج
          </button>
        </header>

        {isLoading && <p className="mt-8 text-sm text-muted-foreground">جارٍ التحميل…</p>}
        {error && (
          <p className="mt-8 rounded-2xl bg-secondary/70 p-4 text-sm text-destructive">
            لا تملك صلاحية المدير على هذا الحساب.
          </p>
        )}

        <div className="mt-8 space-y-4">
          {messages?.map((m) => (
            <article key={m.id} className="surface-card rounded-3xl p-5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm font-bold">{m.display_name}</span>
                <span className="text-[11px] text-muted-foreground">{shortDate(m.created_at)}</span>
                <span className="rounded-full bg-secondary/80 px-2 py-0.5 text-[10px] text-gold">
                  {m.status === "pending"
                    ? "قيد المراجعة"
                    : m.status === "approved"
                      ? "منشورة"
                      : "مرفوضة"}
                </span>
                {m.consent_publish && (
                  <span className="rounded-full bg-secondary/80 px-2 py-0.5 text-[10px] text-muted-foreground">
                    وافق على النشر
                  </span>
                )}
                {m.wants_verified && (
                  <span className="rounded-full bg-secondary/80 px-2 py-0.5 text-[10px] text-muted-foreground">
                    يطلب التوثيق
                  </span>
                )}
              </div>

              <textarea
                value={draft[m.id] ?? m.message}
                maxLength={400}
                rows={3}
                onChange={(e) => setDraft({ ...draft, [m.id]: e.target.value })}
                className="mt-3 w-full resize-none rounded-2xl bg-secondary/70 p-3 text-[13px] leading-relaxed outline-none ring-ring focus-visible:ring-2"
              />

              {m.tx_reference && (
                <p dir="ltr" className="mt-2 truncate text-left font-mono text-[11px] text-muted-foreground">
                  tx: {m.tx_reference.slice(0, 10)}…{m.tx_reference.slice(-6)}
                </p>
              )}

              <div className="mt-3 flex flex-wrap gap-2">
                <button
                  onClick={() =>
                    update.mutate({
                      id: m.id,
                      patch: { status: "approved", message: draft[m.id] ?? m.message },
                    })
                  }
                  className="inline-flex min-h-10 items-center gap-1.5 rounded-full bg-primary px-4 text-xs font-bold text-primary-foreground"
                >
                  <Check className="size-3.5" /> قبول ونشر
                </button>
                <button
                  onClick={() => update.mutate({ id: m.id, patch: { status: "rejected" } })}
                  className="inline-flex min-h-10 items-center gap-1.5 rounded-full bg-secondary/80 px-4 text-xs"
                >
                  <X className="size-3.5" /> رفض / إخفاء
                </button>
                <button
                  onClick={() =>
                    update.mutate({
                      id: m.id,
                      patch: { is_verified_supporter: !m.is_verified_supporter },
                    })
                  }
                  className="inline-flex min-h-10 items-center gap-1.5 rounded-full bg-secondary/80 px-4 text-xs"
                >
                  <BadgeCheck className="size-3.5" />
                  {m.is_verified_supporter ? "إزالة التوثيق" : "داعم موثّق"}
                </button>
                <button
                  onClick={() => update.mutate({ id: m.id, patch: { is_pinned: !m.is_pinned } })}
                  className="inline-flex min-h-10 items-center gap-1.5 rounded-full bg-secondary/80 px-4 text-xs"
                >
                  <Pin className="size-3.5" />
                  {m.is_pinned ? "إلغاء التثبيت" : "تثبيت"}
                </button>
                <button
                  onClick={() => remove.mutate(m.id)}
                  className="inline-flex min-h-10 items-center gap-1.5 rounded-full bg-secondary/80 px-4 text-xs text-destructive"
                >
                  <Trash2 className="size-3.5" /> حذف
                </button>
              </div>
            </article>
          ))}

          {messages?.length === 0 && (
            <p className="text-sm text-muted-foreground">لا توجد رسائل بعد.</p>
          )}
        </div>
      </div>
    </main>
  );
}
