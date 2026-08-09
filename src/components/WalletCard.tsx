import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Check, Copy, ScanLine } from "lucide-react";

type Props = {
  network: string;
  hint: string;
  address: string;
  accent?: "emerald" | "cyan";
};

export function WalletCard({ network, hint, address, accent = "emerald" }: Props) {
  const [copied, setCopied] = useState(false);

  const ring =
    accent === "emerald"
      ? "from-[oklch(0.78_0.15_160)] to-[oklch(0.9_0.09_92)]"
      : "from-[oklch(0.8_0.13_210)] to-[oklch(0.9_0.09_92)]";

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  };

  return (
    <div className="surface-card relative overflow-hidden rounded-3xl p-6 sm:p-8">
      <div
        className={`pointer-events-none absolute -top-24 -left-16 size-56 rounded-full bg-gradient-to-br ${ring} opacity-20 blur-3xl`}
      />

      <div className="relative flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-gradient-gold">{network}</h2>
          <p className="mt-1 text-xs text-muted-foreground">{hint}</p>
        </div>
        <span
          className={`rounded-full bg-gradient-to-br ${ring} px-3 py-1 text-[11px] font-bold text-background`}
        >
          USDT
        </span>
      </div>

      <div className="relative mt-6 flex justify-center">
        <div
          className={`rounded-[26px] bg-gradient-to-br ${ring} p-[2px] shadow-[0_18px_50px_-20px_color-mix(in_oklab,var(--gold)_60%,transparent)]`}
        >
          <div className="rounded-3xl bg-foreground p-4">
            <QRCodeSVG value={address} size={168} level="M" bgColor="transparent" fgColor="#111111" />
          </div>
        </div>
      </div>

      <p className="relative mt-4 flex items-center justify-center gap-2 text-[11px] text-muted-foreground">
        <ScanLine className="size-3.5 text-gold" />
        امسح الرمز من محفظتك
      </p>

      <p
        dir="ltr"
        className="relative mt-4 rounded-2xl bg-secondary/70 p-4 text-center font-mono text-[12px] leading-relaxed break-all text-muted-foreground"
      >
        {address}
      </p>

      <button
        onClick={copy}
        className="relative mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-primary px-4 py-3 text-sm font-bold text-primary-foreground transition-transform hover:scale-[1.02] active:scale-[0.99]"
      >
        {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
        {copied ? "تم نسخ العنوان" : "نسخ العنوان"}
      </button>
    </div>
  );
}
