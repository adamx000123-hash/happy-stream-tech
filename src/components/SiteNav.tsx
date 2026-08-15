import { useEffect, useState } from "react";
import { Heart, Menu, X } from "lucide-react";
import { useSupportFlow } from "@/components/SupportFlow";

const links = [
  { id: "hero", label: "الرئيسية" },
  { id: "goal", label: "الهدف" },
  { id: "support", label: "طرق الدعم" },
  { id: "community", label: "رسائل الداعمين" },
  { id: "faq", label: "الأسئلة الشائعة" },
];

export function scrollToSection(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({ behavior: "smooth", block: "start" });
}

export function SiteNav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const go = (id: string) => {
    setOpen(false);
    scrollToSection(id);
  };

  return (
    <header
      dir="rtl"
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        scrolled ? "border-b border-border bg-background/85 backdrop-blur-xl" : "bg-transparent"
      }`}
    >
      <nav className="mx-auto grid max-w-5xl grid-cols-[auto_1fr_auto] items-center gap-3 px-4 py-3">
        <button
          onClick={() => go("hero")}
          className="shrink-0 text-sm font-extrabold tracking-[0.35em] text-gradient-gold"
        >
          LEGEND
        </button>

        <ul className="hidden min-w-0 items-center justify-center gap-1 md:flex">
          {links.map((l) => (
            <li key={l.id}>
              <button
                onClick={() => go(l.id)}
                className="rounded-full px-3 py-2 text-[13px] text-muted-foreground transition-colors hover:bg-secondary/70 hover:text-foreground"
              >
                {l.label}
              </button>
            </li>
          ))}
        </ul>

        <div className="flex shrink-0 items-center gap-2">
          <button
            onClick={() => go("support")}
            className="inline-flex min-h-11 items-center gap-2 rounded-full bg-primary px-4 text-sm font-bold text-primary-foreground shadow-[var(--shadow-gold)] transition-transform hover:scale-[1.03] active:scale-95"
          >
            <Heart className="size-4" />
            ادعم الآن
          </button>
          <button
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "إغلاق القائمة" : "فتح القائمة"}
            aria-expanded={open}
            className="grid size-11 place-items-center rounded-full bg-secondary/80 text-foreground md:hidden"
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </nav>

      {open && (
        <ul className="animate-fade-in border-t border-border bg-background/95 px-4 py-2 backdrop-blur-xl md:hidden">
          {links.map((l) => (
            <li key={l.id}>
              <button
                onClick={() => go(l.id)}
                className="w-full rounded-xl px-3 py-3 text-right text-sm text-muted-foreground transition-colors hover:bg-secondary/70 hover:text-foreground"
              >
                {l.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </header>
  );
}
