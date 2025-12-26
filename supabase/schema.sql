-- HairVision Pilot - Supabase Schema
-- Run this in Supabase SQL Editor

-- Sessions table for storing analysis results and display state
CREATE TABLE IF NOT EXISTS sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_code VARCHAR(6) UNIQUE NOT NULL,
  analysis_result JSONB,
  current_section VARCHAR(50) DEFAULT 'loading',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '24 hours')
);

-- Index for fast session code lookup
CREATE INDEX IF NOT EXISTS idx_sessions_code ON sessions(session_code);

-- Index for cleanup of expired sessions
CREATE INDEX IF NOT EXISTS idx_sessions_expires ON sessions(expires_at);

-- Auto-update updated_at on changes
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS sessions_updated_at ON sessions;
CREATE TRIGGER sessions_updated_at
  BEFORE UPDATE ON sessions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- Enable Realtime for sessions table
ALTER PUBLICATION supabase_realtime ADD TABLE sessions;

-- Row Level Security (RLS)
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read sessions (no auth required for pilot)
CREATE POLICY "Sessions are viewable by everyone"
  ON sessions FOR SELECT
  USING (true);

-- Allow anyone to insert sessions (barber device creates session)
CREATE POLICY "Anyone can create sessions"
  ON sessions FOR INSERT
  WITH CHECK (true);

-- Allow anyone to update sessions (barber controls navigation)
CREATE POLICY "Anyone can update sessions"
  ON sessions FOR UPDATE
  USING (true);

-- Cleanup function for expired sessions (run via cron or scheduled function)
CREATE OR REPLACE FUNCTION cleanup_expired_sessions()
RETURNS INTEGER AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  DELETE FROM sessions WHERE expires_at < NOW();
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;
