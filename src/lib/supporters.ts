import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";

export type PublicMessage = {
  id: string;
  display_name: string;
  message: string;
  is_verified_supporter: boolean;
  is_pinned: boolean;
  created_at: string;
};

export type AdminMessage = PublicMessage & {
  tx_reference: string | null;
  consent_publish: boolean;
  wants_verified: boolean;
  status: "pending" | "approved" | "rejected";
  admin_note: string | null;
  updated_at: string;
};

export const messageSchema = z.object({
  display_name: z
    .string()
    .trim()
    .min(2, { message: "الاسم قصير جداً" })
    .max(40, { message: "الاسم طويل (40 حرف كحد أقصى)" }),
  message: z
    .string()
    .trim()
    .min(2, { message: "اكتب رسالتك من فضلك" })
    .max(400, { message: "الرسالة طويلة (400 حرف كحد أقصى)" }),
  tx_reference: z
    .string()
    .trim()
    .max(120, { message: "معرّف المعاملة طويل جداً" })
    .optional()
    .or(z.literal("")),
  consent_publish: z.boolean(),
  wants_verified: z.boolean(),
});

export type MessageInput = z.infer<typeof messageSchema>;

export async function fetchPublicMessages(): Promise<PublicMessage[]> {
  const { data, error } = await supabase.rpc("get_public_messages");
  if (error) throw error;
  return (data ?? []) as PublicMessage[];
}

export async function fetchVerifiedCount(): Promise<number> {
  const { data, error } = await supabase.rpc("get_verified_supporters_count");
  if (error) throw error;
  return (data as number) ?? 0;
}

export async function submitMessage(input: MessageInput) {
  const parsed = messageSchema.parse(input);
  const { error } = await supabase.from("supporter_messages").insert({
    display_name: parsed.display_name,
    message: parsed.message,
    tx_reference: parsed.tx_reference ? parsed.tx_reference : null,
    consent_publish: parsed.consent_publish,
    wants_verified: parsed.wants_verified,
  });
  if (error) throw error;
}

export function initials(name: string) {
  return name.trim().charAt(0).toUpperCase() || "؟";
}

export function shortDate(iso: string) {
  try {
    return new Intl.DateTimeFormat("ar", { day: "numeric", month: "short" }).format(new Date(iso));
  } catch {
    return "";
  }
}
