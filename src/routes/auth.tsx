import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Loader2, LogIn } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "دخول الإدارة — LEGEND" },
      { name: "description", content: "صفحة دخول خاصة بصاحب موقع LEGEND لمراجعة رسائل الداعمين." },
      { property: "og:title", content: "دخول الإدارة — LEGEND" },
      { property: "og:description", content: "دخول خاص بصاحب الموقع لمراجعة الرسائل." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
    links: [{ rel: "canonical", href: "https://happy-stream-tech.lovable.app/auth" }],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"in" | "up">("in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "in") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("تم تسجيل الدخول");
        navigate({ to: "/admin" });
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: `${window.location.origin}/admin` },
        });
        if (error) throw error;
        toast.success("تم إنشاء الحساب");
        navigate({ to: "/admin" });
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "تعذّر تسجيل الدخول");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main dir="rtl" className="grid min-h-dvh place-items-center bg-background px-5">
      <form onSubmit={submit} className="surface-card w-full max-w-sm rounded-3xl p-8">
        <h1 className="text-center text-xl font-extrabold text-gradient-gold">دخول الإدارة</h1>

        <div className="mt-6 space-y-4">
          <div>
            <label htmlFor="email" className="text-sm font-bold">
              البريد الإلكتروني
            </label>
            <input
              id="email"
              type="email"
              dir="ltr"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-2 min-h-12 w-full rounded-2xl bg-secondary/70 px-4 text-left text-sm outline-none ring-ring focus-visible:ring-2"
            />
          </div>
          <div>
            <label htmlFor="password" className="text-sm font-bold">
              كلمة المرور
            </label>
            <input
              id="password"
              type="password"
              dir="ltr"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-2 min-h-12 w-full rounded-2xl bg-secondary/70 px-4 text-left text-sm outline-none ring-ring focus-visible:ring-2"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-6 flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl bg-primary text-sm font-bold text-primary-foreground disabled:opacity-60"
        >
          {loading ? <Loader2 className="size-4 animate-spin" /> : <LogIn className="size-4" />}
          {mode === "in" ? "تسجيل الدخول" : "إنشاء حساب"}
        </button>

        <button
          type="button"
          onClick={() => setMode(mode === "in" ? "up" : "in")}
          className="mt-4 w-full text-center text-xs text-muted-foreground hover:text-foreground"
        >
          {mode === "in" ? "إنشاء حساب جديد" : "لدي حساب بالفعل"}
        </button>
      </form>
    </main>
  );
}
