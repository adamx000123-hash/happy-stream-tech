import { useEffect, useMemo, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  BadgeCheck,
  Check,
  Clock,
  Inbox,
  LogOut,
  Pin,
  RefreshCw,
  Search,
  ShieldCheck,
  Trash2,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { shortDate, initials, type AdminMessage } from "@/lib/supporters";

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

type Filter = "pending" | "approved" | "rejected" | "all";

const FILTERS: { key: Filter; label: string }[] = [
  { key: "pending", label: "قيد المراجعة" },
  { key: "approved", label: "منشورة" },
  { key: "rejected", label: "مرفوضة" },
  { key: "all", label: "الكل" },
];

function StatCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
}) {
  return (
    <div className="surface-card rounded-3xl p-4">
      <div className="flex items-center gap-2 text-muted-foreground">
        <span className="text-gold">{icon}</span>
        <span className="text-[11px] font-medium">{label}</span>
      </div>
      <p className="mt-2 text-2xl font-black text-gradient-gold">{value}</p>
    </div>
  );
}

function AdminPage() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [ready, setReady] = useState(false);
  const [draft, setDraft] = useState<Record<string, string>>({});
  const [filter, setFilter] = useState<Filter>("pending");
  const [q, setQ] = useState("");

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) navigate({ to: "/auth" });
      else setReady(true);
    });
  }, [navigate]);

  const { data: messages, isLoading, error, isFetching, refetch } = useQuery({
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
      qc.invalidateQueries({ queryKey: ["public-messages"] });
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
      qc.invalidateQueries({ queryKey: ["public-messages"] });
    },
    onError: () => toast.error("تعذّر الحذف"),
  });

  const counts = useMemo(() => {
    const all = messages ?? [];
    return {
      all: all.length,
      pending: all.filter((m) => m.status === "pending").length,
      approved: all.filter((m) => m.status === "approved").length,
      rejected: all.filter((m) => m.status === "rejected").length,
      verified: all.filter((m) => m.is_verified_supporter).length,
    };
  }, [messages]);

  const visible = useMemo(() => {
    const term = q.trim().toLowerCase();
    return (messages ?? [])
      .filter((m) => (filter === "all" ? true : m.status === filter))
      .filter((m) =>
        term
          ? m.display_name.toLowerCase().includes(term) || m.message.toLowerCase().includes(term)
          : true,
      );
  }, [messages, filter, q]);

  if (!ready) return null;

  return (
    <main dir="rtl" className="min-h-dvh bg-background px-4 py-8">
      <div className="mx-auto max-w-3xl">
        <header className="surface-card grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-3xl p-5">
          <div className="min-w-0">
            <p className="text-[11px] tracking-[0.35em] text-gold">LEGEND</p>
            <h1 className="mt-1 truncate text-xl font-extrabold text-gradient-gold">لوحة المراجعة</h1>
            <p className="mt-1 text-[11px] text-muted-foreground">
              لا تظهر أي رسالة في الموقع إلا بعد قبولها هنا.
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <button
              onClick={() => refetch()}
              aria-label="تحديث"
              className="grid size-11 place-items-center rounded-full bg-secondary/80 transition-transform hover:scale-105"
            >
              <RefreshCw className={`size-4 ${isFetching ? "animate-spin" : ""}`} />
            </button>
            <button
              onClick={async () => {
                await supabase.auth.signOut();
                navigate({ to: "/auth" });
              }}
              className="inline-flex min-h-11 items-center gap-2 rounded-full bg-secondary/80 px-4 text-sm"
            >
              <LogOut className="size-4" />
              خروج
            </button>
          </div>
        </header>

        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <StatCard icon={<Clock className="size-4" />} label="قيد المراجعة" value={counts.pending} />
          <StatCard icon={<Check className="size-4" />} label="منشورة" value={counts.approved} />
          <StatCard icon={<X className="size-4" />} label="مرفوضة" value={counts.rejected} />
          <StatCard icon={<ShieldCheck className="size-4" />} label="موثّقون" value={counts.verified} />
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-2">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`min-h-10 rounded-full px-4 text-xs font-bold transition-colors ${
                filter === f.key
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary/70 text-muted-foreground"
              }`}
            >
              {f.label}
              <span className="ms-1.5 opacity-70">{counts[f.key]}</span>
            </button>
          ))}
        </div>

        <div className="relative mt-3">
          <Search className="pointer-events-none absolute top-1/2 right-4 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="ابحث بالاسم أو نص الرسالة…"
            className="min-h-12 w-full rounded-2xl bg-secondary/70 ps-4 pe-11 text-sm outline-none ring-ring focus-visible:ring-2"
          />
        </div>

        {isLoading && <p className="mt-8 text-sm text-muted-foreground">جارٍ التحميل…</p>}
        {error && (
          <p className="mt-8 rounded-2xl bg-secondary/70 p-4 text-sm text-destructive">
            لا تملك صلاحية المدير على هذا الحساب.
          </p>
        )}

        <div className="mt-6 space-y-4">
          {visible.map((m) => (
            <article key={m.id} className="surface-card rounded-3xl p-5">
              <div className="flex items-start gap-3">
                <span className="grid size-10 shrink-0 place-items-center rounded-full bg-gradient-to-br from-[oklch(0.68_0.11_70)] to-[oklch(0.9_0.09_92)] text-sm font-black text-background">
                  {initials(m.display_name)}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-bold">{m.display_name}</span>
                    <span className="text-[11px] text-muted-foreground">{shortDate(m.created_at)}</span>
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                        m.status === "approved"
                          ? "bg-primary/20 text-gold"
                          : m.status === "rejected"
                            ? "bg-destructive/15 text-destructive"
                            : "bg-secondary/80 text-muted-foreground"
                      }`}
                    >
                      {m.status === "pending"
                        ? "قيد المراجعة"
                        : m.status === "approved"
                          ? "منشورة"
                          : "مرفوضة"}
                    </span>
                    {m.is_pinned && (
                      <span className="rounded-full bg-secondary/80 px-2 py-0.5 text-[10px] text-gold">
                        مثبّتة
                      </span>
                    )}
                    {m.is_verified_supporter && (
                      <span className="rounded-full bg-secondary/80 px-2 py-0.5 text-[10px] text-gold">
                        داعم موثّق
                      </span>
                    )}
                    {m.consent_publish ? (
                      <span className="rounded-full bg-secondary/80 px-2 py-0.5 text-[10px] text-muted-foreground">
                        وافق على النشر
                      </span>
                    ) : (
                      <span className="rounded-full bg-destructive/15 px-2 py-0.5 text-[10px] text-destructive">
                        لم يوافق على النشر
                      </span>
                    )}
                    {m.wants_verified && (
                      <span className="rounded-full bg-secondary/80 px-2 py-0.5 text-[10px] text-muted-foreground">
                        يطلب التوثيق
                      </span>
                    )}
                  </div>
                </div>
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
                  className="inline-flex min-h-10 items-center gap-1.5 rounded-full bg-primary px-4 text-xs font-bold text-primary-foreground transition-transform hover:scale-[1.03]"
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

          {!isLoading && visible.length === 0 && (
            <div className="surface-card rounded-3xl p-8 text-center">
              <Inbox className="mx-auto size-6 text-gold" aria-hidden="true" />
              <p className="mt-3 text-sm text-muted-foreground">لا توجد رسائل في هذا القسم.</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
