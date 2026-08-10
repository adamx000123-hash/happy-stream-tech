CREATE TYPE public.app_role AS ENUM ('admin','moderator','user');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE POLICY "Users can read own roles" ON public.user_roles
FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE TABLE public.supporter_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  display_name text NOT NULL,
  message text NOT NULL,
  tx_reference text,
  consent_publish boolean NOT NULL DEFAULT false,
  wants_verified boolean NOT NULL DEFAULT false,
  status text NOT NULL DEFAULT 'pending',
  is_verified_supporter boolean NOT NULL DEFAULT false,
  is_pinned boolean NOT NULL DEFAULT false,
  admin_note text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT supporter_messages_status_check CHECK (status IN ('pending','approved','rejected')),
  CONSTRAINT supporter_messages_name_len CHECK (char_length(display_name) BETWEEN 1 AND 40),
  CONSTRAINT supporter_messages_message_len CHECK (char_length(message) BETWEEN 2 AND 400),
  CONSTRAINT supporter_messages_tx_len CHECK (tx_reference IS NULL OR char_length(tx_reference) <= 120)
);

GRANT INSERT ON public.supporter_messages TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.supporter_messages TO authenticated;
GRANT ALL ON public.supporter_messages TO service_role;

ALTER TABLE public.supporter_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit a pending message" ON public.supporter_messages
FOR INSERT TO anon, authenticated
WITH CHECK (
  status = 'pending'
  AND is_verified_supporter = false
  AND is_pinned = false
  AND admin_note IS NULL
);

CREATE POLICY "Admins can read all messages" ON public.supporter_messages
FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update messages" ON public.supporter_messages
FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete messages" ON public.supporter_messages
FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER supporter_messages_updated_at
BEFORE UPDATE ON public.supporter_messages
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE OR REPLACE FUNCTION public.get_public_messages()
RETURNS TABLE (
  id uuid,
  display_name text,
  message text,
  is_verified_supporter boolean,
  is_pinned boolean,
  created_at timestamptz
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT id, display_name, message, is_verified_supporter, is_pinned, created_at
  FROM public.supporter_messages
  WHERE status = 'approved' AND consent_publish = true
  ORDER BY is_pinned DESC, created_at DESC
  LIMIT 50
$$;

GRANT EXECUTE ON FUNCTION public.get_public_messages() TO anon, authenticated;

CREATE OR REPLACE FUNCTION public.get_verified_supporters_count()
RETURNS integer
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT count(*)::int FROM public.supporter_messages
  WHERE status = 'approved' AND is_verified_supporter = true
$$;

GRANT EXECUTE ON FUNCTION public.get_verified_supporters_count() TO anon, authenticated;