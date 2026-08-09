import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Check, Copy } from "lucide-react";

type Props = {
  network: string;
  hint: string;
  address: string;
};

export function WalletCard({ network, hint, address }: Props) {
  const [copied, setCopied] = useState(false);

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
    <div className="surface-card rounded-3xl p-6 sm:p-8">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h3 className="text-lg font-bold text-gradient-gold">{network}</h3>
          <p className="mt-1 text-xs text-muted-foreground">{hint}</p>
        </div>
        <span className="rounded-full border border-gold/40 px-3 py-1 text-[11px] text-gold">
          USDT
        </span>
      </div>

      <div className="mt-6 flex justify-center">
        <div className="rounded-2xl bg-foreground p-3">
          <QRCodeSVG value={address} size={168} level="M" bgColor="transparent" fgColor="#111111" />
        </div>
      </div>

      <p
        dir="ltr"
        className="mt-6 rounded-2xl bg-secondary/70 p-4 text-center font-mono text-[12px] leading-relaxed break-all text-muted-foreground"
      >
        {address}
      </p>

      <button
        onClick={copy}
        className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-primary px-4 py-3 text-sm font-bold text-primary-foreground transition-transform hover:scale-[1.02] active:scale-[0.99]"
      >
        {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
        {copied ? "تم نسخ العنوان" : "نسخ العنوان"}
      </button>
    </div>
  );
}
