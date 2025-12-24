-- Plainly AI Database Schema
-- Run this in your Supabase SQL Editor

-- =====================================================
-- LEADS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Contact info
  email TEXT NOT NULL,
  first_name TEXT,
  last_name TEXT,
  company_name TEXT,
  phone TEXT,
  
  -- Qualification
  team_size TEXT,
  service_interest TEXT,
  main_challenge TEXT,
  
  -- Source & scoring
  source TEXT NOT NULL,
  lead_score INTEGER DEFAULT 0,
  
  -- Status
  status TEXT DEFAULT 'new',
  
  -- Chatbot specific
  chatbot_conversation_id UUID,
  chatbot_summary TEXT,
  
  -- Readiness check specific
  readiness_score INTEGER,
  readiness_answers JSONB,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_source ON leads(source);
CREATE INDEX IF NOT EXISTS idx_leads_created ON leads(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_leads_email ON leads(email);

-- =====================================================
-- LEAD NOTES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS lead_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,
  note TEXT NOT NULL,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_lead_notes_lead ON lead_notes(lead_id);

-- =====================================================
-- LEAD EVENTS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS lead_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  event_data JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_lead_events_lead ON lead_events(lead_id);

-- =====================================================
-- CHATBOT MESSAGES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS chatbot_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL,
  role TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_chatbot_messages_conversation ON chatbot_messages(conversation_id);

-- =====================================================
-- ROW LEVEL SECURITY
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE lead_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE lead_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE chatbot_messages ENABLE ROW LEVEL SECURITY;

-- Leads: Authenticated users can read/write
CREATE POLICY "Authenticated users can view leads"
  ON leads FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert leads"
  ON leads FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update leads"
  ON leads FOR UPDATE
  TO authenticated
  USING (true);

-- Lead Notes: Authenticated users can read/write
CREATE POLICY "Authenticated users can view lead notes"
  ON lead_notes FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert lead notes"
  ON lead_notes FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Lead Events: Authenticated users can read/write
CREATE POLICY "Authenticated users can view lead events"
  ON lead_events FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert lead events"
  ON lead_events FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Chatbot Messages: Authenticated users can read
CREATE POLICY "Authenticated users can view chatbot messages"
  ON chatbot_messages FOR SELECT
  TO authenticated
  USING (true);

-- Note: Chatbot message insertion is handled via service role key
-- in the API route, not through RLS policies

-- =====================================================
-- UPDATED_AT TRIGGER
-- =====================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_leads_updated_at
  BEFORE UPDATE ON leads
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
