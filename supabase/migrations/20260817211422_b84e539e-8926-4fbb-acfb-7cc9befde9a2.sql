GRANT INSERT ON public.supporter_messages TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.supporter_messages TO authenticated;
GRANT ALL ON public.supporter_messages TO service_role;
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'::app_role FROM auth.users
ON CONFLICT (user_id, role) DO NOTHING;