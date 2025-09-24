-- policies.sql: Supabase Row Level Security policies. Run in Supabase SQL editor.

ALTER TABLE IF EXISTS profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Profiles: public select" ON profiles
  FOR SELECT USING (is_public = true);
CREATE POLICY "Profiles: self select" ON profiles
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Profiles: insert own" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Profiles: update own" ON profiles
  FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Profiles: delete own" ON profiles
  FOR DELETE USING (auth.uid() = user_id);

ALTER TABLE IF EXISTS links ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Links: public select" ON links
  FOR SELECT USING (exists (select 1 from profiles p where p.id=links.profile_id and p.is_public=true));
CREATE POLICY "Links: owner manage" ON links
  FOR ALL USING (auth.uid()=(select user_id from profiles where id=links.profile_id))
  WITH CHECK (auth.uid()=(select user_id from profiles where id=links.profile_id));

ALTER TABLE IF EXISTS link_clicks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "LinkClicks: insert anyone" ON link_clicks FOR INSERT WITH CHECK (true);
CREATE POLICY "LinkClicks: owner select" ON link_clicks FOR SELECT
  USING (auth.uid()=(select user_id from profiles where id=link_clicks.profile_id));

ALTER TABLE IF EXISTS templates ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Templates: public select" ON templates FOR SELECT USING (true);
CREATE POLICY "Templates: owner manage" ON templates
  FOR ALL USING (auth.uid()=owner_user_id) WITH CHECK (auth.uid()=owner_user_id);

ALTER TABLE IF EXISTS purchases ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Purchases: insert auth" ON purchases FOR INSERT WITH CHECK (auth.uid()=user_id);
CREATE POLICY "Purchases: owner select" ON purchases FOR SELECT USING (auth.uid()=user_id);

ALTER TABLE IF EXISTS tips ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Tips: insert auth" ON tips FOR INSERT WITH CHECK (true);
CREATE POLICY "Tips: owner select" ON tips FOR SELECT
  USING (auth.uid()=(select user_id from profiles where id=tips.profile_id));
