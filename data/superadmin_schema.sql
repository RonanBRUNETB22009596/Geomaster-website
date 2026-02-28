-- 1. Update Profiles Role Constraint to allow 'super_admin'
-- Note: PostgreSQL requires dropping and recreating check constraints to add new valid values
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_role_check;
ALTER TABLE public.profiles ADD CONSTRAINT profiles_role_check CHECK (role IN ('user', 'admin', 'super_admin'));

-- 2. Create Site Settings Table
CREATE TABLE public.site_settings (
  key text PRIMARY KEY,
  value jsonb NOT NULL,
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
-- Public can view settings (e.g., maintenance mode, welcome text)
CREATE POLICY "Public can view settings" ON site_settings FOR SELECT USING (true);
-- Only super_admins can modify settings
CREATE POLICY "Super Admins can modify settings" ON site_settings
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'super_admin')
  );

-- Insert default settings
INSERT INTO public.site_settings (key, value) VALUES 
('maintenance_mode', 'false'::jsonb),
('hero_text', '{"title": "Explorez le Monde", "subtitle": "Découvrez notre test de géographie."}'::jsonb)
ON CONFLICT (key) DO NOTHING;

-- 3. Create Page Views (Stats) Table
CREATE TABLE public.page_views (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  path text NOT NULL,
  user_id uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE public.page_views ENABLE ROW LEVEL SECURITY;
-- Anyone can insert a page view
CREATE POLICY "Public can insert page views" ON page_views FOR INSERT WITH CHECK (true);
-- Only admins and super_admins can read page views
CREATE POLICY "Admins can view page views" ON page_views
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
  );

-- 4. Create Error Logs Table
CREATE TABLE public.error_logs (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  message text NOT NULL,
  stack text,
  path text,
  user_id uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE public.error_logs ENABLE ROW LEVEL SECURITY;
-- Anyone (client/server) can insert an error log
CREATE POLICY "Public can insert error logs" ON error_logs FOR INSERT WITH CHECK (true);
-- Only super_admins can view error logs
CREATE POLICY "Super Admins can view error logs" ON error_logs
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'super_admin')
  );

-- 5. Update Policies for QuestionsCRUD
-- Currently, questions only has a SELECT policy for public.
-- We must add INSERT/UPDATE/DELETE policies for admins and super_admins.
CREATE POLICY "Admins can insert questions" ON questions
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
  );
  
CREATE POLICY "Admins can update questions" ON questions
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
  );
  
CREATE POLICY "Admins can delete questions" ON questions
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
  );

-- 6. Update Policies for Profiles (Admins viewing users)
-- Currently Admins can view all profiles. Let's make sure super_admins can update profiles (e.g., ban them or change roles)
CREATE POLICY "Super Admins can update profiles" ON profiles
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'super_admin')
  );
