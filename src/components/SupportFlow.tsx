import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { QRCodeSVG } from "qrcode.react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  ArrowRight,
  BadgeCheck,
  Check,
  Copy,
  Download,
  HelpCircle,
  Loader2,
  ShieldAlert,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { submitMessage } from "@/lib/supporters";

export type NetworkId = "bep20" | "aptos";

export const NETWORKS: Record<
  NetworkId,
  { id: NetworkId; label: string; chain: string; hint: string; cta: string; address: string }
> = {
  bep20: {
    id: "bep20",
    label: "USDT — BEP20",
    chain: "BNB Smart Chain",
    hint: "اخترها إذا كانت محفظتك تستخدم BNB Smart Chain أو BEP20",
    cta: "اختيار BEP20",
    address: "0x4e817ab10246f592c00434a4d2147e4f63348951",
  },
  aptos: {
    id: "aptos",
    label: "USDT — APTOS",
    chain: "Aptos",
    hint: "اخترها إذا كانت محفظتك تستخدم شبكة Aptos",
    cta: "اختيار Aptos",
    address: "0x7a3a37ee388044b59cc04eeba56a933f2323da744fa893c01d2c413725a3c3d8",
  },
};

type Ctx = { open: (network?: NetworkId) => void };
const SupportFlowContext = createContext<Ctx | null>(null);

export function useSupportFlow() {
  const ctx = useContext(SupportFlowContext);
  if (!ctx) throw new Error("useSupportFlow must be used inside SupportFlowProvider");
  return ctx;
}

type Step = "network" | "send" | "ask" | "form" | "done";

const steps: { key: Step; label: string }[] = [
  { key: "network", label: "اختيار الشبكة" },
  { key: "send", label: "الإرسال" },
  { key: "form", label: "رسالة اختيارية" },
];

function StepBar({ step }: { step: Step }) {
  const index = step === "network" ? 0 : step === "send" || step === "ask" ? 1 : 2;
  return (
    <ol className="flex items-center justify-center gap-2 text-[11px]">
      {steps.map((s, i) => (
        <li key={s.key} className="flex items-center gap-2">
          <span
            className={`rounded-full px-3 py-1 font-bold transition-colors ${
              i <= index ? "bg-gold/15 text-gold" : "bg-secondary/70 text-muted-foreground"
            }`}
          >
            {i + 1} {s.label}
          </span>
          {i < steps.length - 1 && <ArrowRight className="size-3 text-muted-foreground rotate-180" aria-hidden="true" />}
        </li>
      ))}
    </ol>
  );
}

function NetworkChoice({ onPick }: { onPick: (n: NetworkId) => void }) {
  const [help, setHelp] = useState(false);
  return (
    <div>
      <h2 id="support-flow-title" className="text-center text-xl font-extrabold sm:text-2xl">
        اختر <span className="text-gradient-gold">شبكة الإرسال</span>
      </h2>
      <p className="mx-auto mt-2 max-w-md text-center text-[13px] leading-relaxed text-muted-foreground">
        اختر الشبكة التي تستخدمها في محفظتك. إرسال USDT عبر شبكة خاطئة قد يؤدي إلى فقدان الأموال.
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {Object.values(NETWORKS).map((n) => (
          <button
            key={n.id}
            onClick={() => onPick(n.id)}
            className="surface-card group flex h-full flex-col rounded-3xl p-5 text-right transition-transform hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
          >
            <div className="flex items-center justify-between gap-2">
              <span className="text-base font-bold text-gradient-gold">{n.label}</span>
              <span className="rounded-full bg-secondary/80 px-2.5 py-1 text-[10px] font-bold text-gold">
                USDT
              </span>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">الشبكة: {n.chain}</p>
            <p className="mt-3 grow text-[13px] leading-relaxed text-muted-foreground">{n.hint}</p>
            <span className="mt-4 inline-flex min-h-11 items-center justify-center rounded-2xl bg-primary px-4 text-sm font-bold text-primary-foreground">
              {n.cta}
            </span>
          </button>
        ))}
      </div>

      <button
        onClick={() => setHelp((v) => !v)}
        aria-expanded={help}
        className="mx-auto mt-5 flex items-center gap-2 rounded-full px-3 py-2 text-xs text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
      >
        <HelpCircle className="size-4" aria-hidden="true" />
        لست متأكداً من الشبكة؟
      </button>
      {help && (
        <p className="mx-auto mt-2 max-w-lg rounded-2xl bg-secondary/60 p-4 text-[12px] leading-relaxed text-muted-foreground">
          افتح محفظتك واختر USDT ثم «إيداع/استلام»، وستظهر لك قائمة الشبكات. إذا رأيت
          «BNB Smart Chain (BEP20)» اختر BEP20، وإذا كانت محفظتك على Aptos اختر Aptos. الشبكة
          المعروضة في محفظتك يجب أن تطابق الشبكة التي تختارها هنا.
        </p>
      )}
    </div>
  );
}

function SendPanel({
  network,
  onChange,
  onNext,
}: {
  network: NetworkId;
  onChange: () => void;
  onNext: () => void;
}) {
  const n = NETWORKS[network];
  const [copied, setCopied] = useState(false);
  const qrRef = useRef<HTMLDivElement>(null);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(n.address);
      setCopied(true);
      toast.success("تم نسخ العنوان. تأكد من الشبكة قبل الإرسال.");
      setTimeout(() => setCopied(false), 2500);
    } catch {
      toast.error("تعذّر النسخ، انسخ العنوان يدوياً");
    }
  };

  const downloadQr = () => {
    const svg = qrRef.current?.querySelector("svg");
    if (!svg) return;
    const xml = new XMLSerializer().serializeToString(svg);
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = 640;
      canvas.height = 640;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, 640, 640);
      ctx.drawImage(img, 40, 40, 560, 560);
      const a = document.createElement("a");
      a.href = canvas.toDataURL("image/png");
      a.download = `legend-usdt-${n.id}.png`;
      a.click();
    };
    img.src = `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(xml)))}`;
  };

  return (
    <div>
      <h2 id="support-flow-title" className="sr-only">
        صفحة الإرسال
      </h2>
      <div className="surface-card flex flex-wrap items-center justify-between gap-3 rounded-2xl p-4">
        <div>
          <p className="text-sm font-bold text-gradient-gold">{n.label}</p>
          <p className="mt-0.5 text-[11px] text-muted-foreground">الشبكة: {n.chain}</p>
        </div>
        <button
          onClick={onChange}
          className="min-h-10 rounded-full border border-border px-4 text-xs font-bold text-foreground transition-colors hover:bg-secondary/70"
        >
          تغيير الشبكة
        </button>
      </div>

      <div ref={qrRef} className="mt-5 flex justify-center">
        <div className="rounded-[26px] bg-gradient-to-br from-[oklch(0.9_0.09_92)] to-[oklch(0.78_0.15_160)] p-[2px]">
          <div className="rounded-3xl bg-white p-4">
            <QRCodeSVG
              value={n.address}
              size={196}
              level="M"
              bgColor="#ffffff"
              fgColor="#0b0b0b"
              title={`رمز QR لعنوان ${n.label}`}
            />
          </div>
        </div>
      </div>

      <p
        dir="ltr"
        className="mt-5 rounded-2xl bg-secondary/70 p-4 text-center font-mono text-[12px] leading-relaxed break-all text-muted-foreground select-all"
      >
        {n.address}
      </p>

      <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_auto]">
        <button
          onClick={copy}
          className="flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-primary px-4 text-sm font-bold text-primary-foreground transition-transform hover:scale-[1.01] active:scale-[0.99]"
        >
          {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
          {copied ? "تم نسخ العنوان" : "نسخ العنوان"}
        </button>
        <button
          onClick={downloadQr}
          className="flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-border px-4 text-sm font-bold text-foreground transition-colors hover:bg-secondary/70"
        >
          <Download className="size-4" />
          تنزيل QR
        </button>
      </div>

      <p className="mt-4 flex items-start gap-2 rounded-2xl bg-destructive/10 p-4 text-[12px] leading-relaxed text-foreground">
        <ShieldAlert className="mt-0.5 size-4 shrink-0 text-gold" aria-hidden="true" />
        أرسل USDT عبر شبكة {n.chain} فقط. معاملات البلوكشين قد لا يمكن استرجاعها.
      </p>

      <div className="surface-card mt-5 rounded-2xl p-4">
        <p className="text-sm font-bold">هل ترغب في ترك رسالة؟</p>
        <p className="mt-1 text-[12px] leading-relaxed text-muted-foreground">
          يمكنك إرسال رسالة قصيرة، ويمكنك اختيار نشرها باسم مستعار. هذا الخيار اختياري تماماً ولا
          يؤثر على الوصول إلى عنوان الدعم.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <button
            onClick={onNext}
            className="min-h-11 rounded-2xl bg-secondary px-4 text-sm font-bold text-foreground transition-colors hover:bg-secondary/70"
          >
            نعم، أريد ترك رسالة
          </button>
          <button
            onClick={() => toast("تمام، يمكنك الإرسال مباشرة بدون أي رسالة.")}
            className="min-h-11 rounded-2xl border border-border px-4 text-sm font-bold text-muted-foreground transition-colors hover:text-foreground"
          >
            ليس الآن
          </button>
        </div>
      </div>
    </div>
  );
}

function MessageForm({ onBack, onDone }: { onBack: () => void; onDone: () => void }) {
  const qc = useQueryClient();
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [tx, setTx] = useState("");
  const [consent, setConsent] = useState(false);
  const [verified, setVerified] = useState(false);
  const [honey, setHoney] = useState("");
  const [error, setError] = useState("");

  const mutation = useMutation({
    mutationFn: submitMessage,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["public-messages"] });
      onDone();
    },
    onError: () => toast.error("تعذّر إرسال الرسالة، حاول مرة أخرى"),
  });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (honey) return;
    const text = message.trim();
    if (text.length < 2) {
      setError("اكتب رسالتك من فضلك");
      return;
    }
    setError("");
    mutation.mutate({
      display_name: name.trim() || "داعم مجهول",
      message: text,
      tx_reference: tx.trim(),
      consent_publish: consent,
      wants_verified: verified,
    });
  };

  return (
    <form onSubmit={submit} noValidate>
      <h2 id="support-flow-title" className="text-lg font-extrabold">
        رسالة اختيارية
      </h2>
      <p className="mt-1 text-[12px] text-muted-foreground">
        لا تُدخل أبداً مفتاحاً خاصاً أو كلمة مرور أو عبارة استرداد.
      </p>

      <input
        value={honey}
        onChange={(e) => setHoney(e.target.value)}
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="hidden"
      />

      <div className="mt-5 space-y-4">
        <div>
          <label htmlFor="sf-name" className="text-sm font-bold">
            الاسم أو الاسم المستعار (اختياري)
          </label>
          <input
            id="sf-name"
            value={name}
            maxLength={40}
            onChange={(e) => setName(e.target.value)}
            placeholder="مثلاً: كريم"
            className="mt-2 min-h-12 w-full rounded-2xl bg-secondary/70 px-4 text-sm outline-none ring-ring focus-visible:ring-2"
          />
        </div>

        <div>
          <label htmlFor="sf-msg" className="text-sm font-bold">
            الرسالة
          </label>
          <textarea
            id="sf-msg"
            value={message}
            maxLength={280}
            rows={4}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="اكتب كلمة طيبة…"
            className="mt-2 w-full resize-none rounded-2xl bg-secondary/70 p-4 text-sm leading-relaxed outline-none ring-ring focus-visible:ring-2"
          />
          <p className="mt-1 text-left text-[11px] text-muted-foreground">{message.length}/280</p>
          {error && <p className="text-xs text-destructive">{error}</p>}
        </div>

        <div>
          <label htmlFor="sf-tx" className="text-sm font-bold">
            معرّف المعاملة (اختياري)
          </label>
          <input
            id="sf-tx"
            dir="ltr"
            value={tx}
            maxLength={120}
            onChange={(e) => setTx(e.target.value)}
            placeholder="0x…"
            className="mt-2 min-h-12 w-full rounded-2xl bg-secondary/70 px-4 text-left font-mono text-xs outline-none ring-ring focus-visible:ring-2"
          />
          <p className="mt-1 text-[11px] text-muted-foreground">
            يُستعمل للتحقق فقط ولا يُعرض للزوار.
          </p>
        </div>

        <label className="flex min-h-11 cursor-pointer items-center gap-3 text-sm">
          <input
            type="checkbox"
            checked={consent}
            onChange={(e) => setConsent(e.target.checked)}
            className="size-5 accent-[var(--gold)]"
          />
          أوافق على نشر رسالتي في الموقع
        </label>

        <label className="flex min-h-11 cursor-pointer items-center gap-3 text-sm">
          <input
            type="checkbox"
            checked={verified}
            onChange={(e) => setVerified(e.target.checked)}
            className="size-5 accent-[var(--gold)]"
          />
          أرغب في الظهور كداعم موثّق بعد المراجعة
        </label>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-[1fr_auto]">
        <button
          type="submit"
          disabled={mutation.isPending}
          className="flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-primary px-4 text-sm font-bold text-primary-foreground disabled:opacity-60"
        >
          {mutation.isPending && <Loader2 className="size-4 animate-spin" />}
          إرسال الرسالة للمراجعة
        </button>
        <button
          type="button"
          onClick={onBack}
          className="min-h-12 rounded-2xl border border-border px-4 text-sm font-bold text-muted-foreground transition-colors hover:text-foreground"
        >
          رجوع
        </button>
      </div>
    </form>
  );
}

export function SupportFlowProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState<Step>("network");
  const [network, setNetwork] = useState<NetworkId | null>(null);

  const close = useCallback(() => setIsOpen(false), []);

  const open = useCallback((n?: NetworkId) => {
    setNetwork(n ?? null);
    setStep(n ? "send" : "network");
    setIsOpen(true);
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [isOpen, close]);

  const value = useMemo(() => ({ open }), [open]);

  return (
    <SupportFlowContext.Provider value={value}>
      {children}
      {isOpen && (
        <div
          dir="rtl"
          className="fixed inset-0 z-[70] flex items-end justify-center bg-background/80 p-0 backdrop-blur-md sm:items-center sm:p-6"
        >
          <button
            aria-label="إغلاق"
            onClick={close}
            className="absolute inset-0 cursor-default"
            tabIndex={-1}
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="support-flow-title"
            className="animate-fade-in relative flex max-h-[92dvh] w-full max-w-2xl flex-col overflow-hidden rounded-t-3xl border border-border bg-card shadow-[var(--shadow-gold)] sm:max-h-[88dvh] sm:rounded-3xl"
          >
            <div className="flex items-center justify-between gap-3 border-b border-border/60 bg-card/95 px-5 py-3 sm:px-7">
              <div className="min-w-0 overflow-x-auto">
                <StepBar step={step} />
              </div>
              <button
                onClick={close}
                aria-label="إغلاق نافذة الدعم"
                className="grid size-10 shrink-0 place-items-center rounded-full bg-secondary/80 text-foreground transition-colors hover:bg-secondary"
              >
                <X className="size-5" />
              </button>
            </div>

            <div className="overflow-y-auto overscroll-contain px-5 py-5 sm:px-7 sm:py-6">


            {step === "network" && (
              <NetworkChoice
                onPick={(n) => {
                  setNetwork(n);
                  setStep("send");
                }}
              />
            )}

            {step === "send" && network && (
              <SendPanel
                network={network}
                onChange={() => setStep("network")}
                onNext={() => setStep("form")}
              />
            )}

            {step === "form" && (
              <MessageForm onBack={() => setStep("send")} onDone={() => setStep("done")} />
            )}

            {step === "done" && (
              <div className="py-6 text-center">
                <BadgeCheck className="mx-auto size-10 text-gold" aria-hidden="true" />
                <h2 id="support-flow-title" className="mt-4 text-lg font-extrabold">
                  شكراً لك
                </h2>
                <p className="mx-auto mt-2 max-w-md text-[13px] leading-relaxed text-muted-foreground">
                  وصلت رسالتك وستتم مراجعتها قبل نشرها. لا نطلب منك أبداً أي مفتاح خاص أو كلمة مرور.
                </p>
                <div className="mt-6 flex flex-wrap justify-center gap-3">
                  <button
                    onClick={() => setStep("send")}
                    className="min-h-11 rounded-2xl border border-border px-5 text-sm font-bold text-foreground hover:bg-secondary/70"
                  >
                    العودة لصفحة الإرسال
                  </button>
                  <button
                    onClick={close}
                    className="min-h-11 rounded-2xl bg-primary px-5 text-sm font-bold text-primary-foreground"
                  >
                    إغلاق
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </SupportFlowContext.Provider>
  );
}
