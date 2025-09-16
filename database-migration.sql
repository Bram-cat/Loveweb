-- Database Migration Script
-- This script updates your Supabase database to match the subscription system

-- First, let's add missing columns to the subscriptions table
ALTER TABLE subscriptions
ADD COLUMN IF NOT EXISTS is_premium BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS is_unlimited BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS billing_cycle VARCHAR(20) DEFAULT 'monthly',
ADD COLUMN IF NOT EXISTS stripe_customer_id VARCHAR(255);

-- Update existing subscriptions to set the boolean flags based on subscription_type
UPDATE subscriptions
SET
  is_premium = (subscription_type = 'premium' OR subscription_type = 'unlimited'),
  is_unlimited = (subscription_type = 'unlimited'),
  billing_cycle = CASE
    WHEN EXTRACT(MONTH FROM AGE(ends_at, starts_at)) >= 11 THEN 'yearly'
    ELSE 'monthly'
  END
WHERE subscription_type IS NOT NULL;

-- Make sure profiles table has all required columns
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS birth_time TIME,
ADD COLUMN IF NOT EXISTS birth_location VARCHAR(255),
ADD COLUMN IF NOT EXISTS wants_premium BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS wants_notifications BOOLEAN DEFAULT TRUE,
ADD COLUMN IF NOT EXISTS agreed_to_terms BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN DEFAULT FALSE;

-- Update existing profiles to set default values
UPDATE profiles
SET
  wants_premium = FALSE,
  wants_notifications = TRUE,
  agreed_to_terms = FALSE,
  onboarding_completed = FALSE
WHERE wants_premium IS NULL;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id_status ON subscriptions(user_id, status);
CREATE INDEX IF NOT EXISTS idx_subscriptions_stripe_subscription_id ON subscriptions(stripe_subscription_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_stripe_customer_id ON subscriptions(stripe_customer_id);
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_love_matches_user_id_created_at ON love_matches(user_id, created_at);
CREATE INDEX IF NOT EXISTS idx_numerology_readings_user_id_created_at ON numerology_readings(user_id, created_at);
CREATE INDEX IF NOT EXISTS idx_trust_assessments_user_id_created_at ON trust_assessments(user_id, created_at);

-- Add constraints to ensure data integrity
ALTER TABLE subscriptions
ADD CONSTRAINT check_subscription_type
CHECK (subscription_type IN ('free', 'premium', 'unlimited'));

ALTER TABLE subscriptions
ADD CONSTRAINT check_status
CHECK (status IN ('active', 'canceled', 'past_due', 'incomplete'));

ALTER TABLE subscriptions
ADD CONSTRAINT check_billing_cycle
CHECK (billing_cycle IN ('monthly', 'yearly'));

-- Create a function to automatically update the boolean flags when subscription_type changes
CREATE OR REPLACE FUNCTION update_subscription_flags()
RETURNS TRIGGER AS $$
BEGIN
  NEW.is_premium := (NEW.subscription_type = 'premium' OR NEW.subscription_type = 'unlimited');
  NEW.is_unlimited := (NEW.subscription_type = 'unlimited');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update flags
DROP TRIGGER IF EXISTS trigger_update_subscription_flags ON subscriptions;
CREATE TRIGGER trigger_update_subscription_flags
  BEFORE INSERT OR UPDATE OF subscription_type ON subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION update_subscription_flags();

-- Create a view for easy subscription status checking
CREATE OR REPLACE VIEW subscription_status AS
SELECT
  s.id,
  s.user_id,
  s.subscription_type,
  s.status,
  s.is_premium,
  s.is_unlimited,
  s.billing_cycle,
  s.starts_at,
  s.ends_at,
  s.stripe_subscription_id,
  s.stripe_customer_id,
  s.created_at,
  s.updated_at,
  CASE
    WHEN s.ends_at IS NOT NULL AND s.ends_at < NOW() THEN TRUE
    ELSE FALSE
  END AS is_expired,
  CASE
    WHEN s.ends_at IS NOT NULL THEN
      EXTRACT(DAY FROM s.ends_at - NOW())
    ELSE NULL
  END AS days_remaining
FROM subscriptions s
WHERE s.status = 'active'
ORDER BY s.created_at DESC;

-- Insert some sample data for testing (only if tables are empty)
-- This will help verify the system works correctly

INSERT INTO profiles (user_id, email, full_name, wants_premium, wants_notifications, agreed_to_terms, onboarding_completed)
SELECT 'test_user_001', 'test@example.com', 'Test User', FALSE, TRUE, TRUE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM profiles WHERE user_id = 'test_user_001');

-- Add RLS policies for security (if not already present)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE love_matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE numerology_readings ENABLE ROW LEVEL SECURITY;
ALTER TABLE trust_assessments ENABLE ROW LEVEL SECURITY;

-- Create policies to allow service role to access all data
CREATE POLICY IF NOT EXISTS "Service role can access all profiles" ON profiles
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY IF NOT EXISTS "Service role can access all subscriptions" ON subscriptions
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY IF NOT EXISTS "Service role can access all love_matches" ON love_matches
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY IF NOT EXISTS "Service role can access all numerology_readings" ON numerology_readings
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY IF NOT EXISTS "Service role can access all trust_assessments" ON trust_assessments
  FOR ALL USING (auth.role() = 'service_role');

-- Allow users to access their own data
CREATE POLICY IF NOT EXISTS "Users can access own profile" ON profiles
  FOR ALL USING (auth.uid()::text = user_id);

CREATE POLICY IF NOT EXISTS "Users can access own subscriptions" ON subscriptions
  FOR ALL USING (auth.uid()::text = user_id);

CREATE POLICY IF NOT EXISTS "Users can access own love_matches" ON love_matches
  FOR ALL USING (auth.uid()::text = user_id);

CREATE POLICY IF NOT EXISTS "Users can access own numerology_readings" ON numerology_readings
  FOR ALL USING (auth.uid()::text = user_id);

CREATE POLICY IF NOT EXISTS "Users can access own trust_assessments" ON trust_assessments
  FOR ALL USING (auth.uid()::text = user_id);