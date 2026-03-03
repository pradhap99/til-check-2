-- Add barter-related columns to campaigns
ALTER TABLE public.campaigns 
  ADD COLUMN IF NOT EXISTS is_barter boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS barter_product_name text,
  ADD COLUMN IF NOT EXISTS barter_product_value text,
  ADD COLUMN IF NOT EXISTS barter_product_description text;

-- Add max_revisions and revision_deadline to campaign_deliverables
ALTER TABLE public.campaign_deliverables
  ADD COLUMN IF NOT EXISTS max_revisions integer DEFAULT 2,
  ADD COLUMN IF NOT EXISTS revision_deadline_hours integer DEFAULT 48;

-- Add deadline_at to deliverable_submissions
ALTER TABLE public.deliverable_submissions
  ADD COLUMN IF NOT EXISTS deadline_at timestamp with time zone,
  ADD COLUMN IF NOT EXISTS escalated boolean DEFAULT false;

-- Admin RLS policies
CREATE POLICY "Admins can view all profiles" ON public.profiles
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can view all campaigns" ON public.campaigns
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update all campaigns" ON public.campaigns
  FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can view all applications" ON public.campaign_applications
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update all applications" ON public.campaign_applications
  FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can view all transactions" ON public.transactions
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update all transactions" ON public.transactions
  FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can view all disputes" ON public.disputes
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update all disputes" ON public.disputes
  FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can view all creator profiles" ON public.creator_profiles
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can view all brand profiles" ON public.brand_profiles
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can view all user roles" ON public.user_roles
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can view all notifications" ON public.notifications
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can view all submissions" ON public.deliverable_submissions
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update all submissions" ON public.deliverable_submissions
  FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));