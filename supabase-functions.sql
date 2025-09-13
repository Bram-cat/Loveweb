-- Create the required database tables and functions for Lovelock Web

-- Create user_subscriptions table
CREATE TABLE IF NOT EXISTS user_subscriptions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id TEXT NOT NULL,
    clerk_id TEXT NOT NULL UNIQUE,
    stripe_customer_id TEXT,
    stripe_subscription_id TEXT,
    tier TEXT NOT NULL DEFAULT 'free' CHECK (tier IN ('free', 'premium', 'unlimited')),
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'canceled', 'past_due', 'incomplete')),
    current_period_start TIMESTAMP WITH TIME ZONE,
    current_period_end TIMESTAMP WITH TIME ZONE,
    cancel_at_period_end BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create usage_tracking table
CREATE TABLE IF NOT EXISTS usage_tracking (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id TEXT NOT NULL,
    clerk_id TEXT NOT NULL UNIQUE,
    numerology_count INTEGER DEFAULT 0,
    love_match_count INTEGER DEFAULT 0,
    trust_assessment_count INTEGER DEFAULT 0,
    reset_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_clerk_id ON user_subscriptions(clerk_id);
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_stripe_customer_id ON user_subscriptions(stripe_customer_id);
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_status ON user_subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_usage_tracking_clerk_id ON usage_tracking(clerk_id);

-- Enable Row Level Security
ALTER TABLE user_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE usage_tracking ENABLE ROW LEVEL SECURITY;

-- RLS policies for user_subscriptions
CREATE POLICY IF NOT EXISTS "Users can view their own subscription" ON user_subscriptions
    FOR SELECT USING (clerk_id = current_setting('request.jwt.claims', true)::json->>'sub');

CREATE POLICY IF NOT EXISTS "Users can update their own subscription" ON user_subscriptions
    FOR UPDATE USING (clerk_id = current_setting('request.jwt.claims', true)::json->>'sub');

CREATE POLICY IF NOT EXISTS "System can manage all subscriptions" ON user_subscriptions
    FOR ALL USING (current_setting('role') = 'service_role');

-- RLS policies for usage_tracking
CREATE POLICY IF NOT EXISTS "Users can view their own usage" ON usage_tracking
    FOR SELECT USING (clerk_id = current_setting('request.jwt.claims', true)::json->>'sub');

CREATE POLICY IF NOT EXISTS "Users can update their own usage" ON usage_tracking
    FOR UPDATE USING (clerk_id = current_setting('request.jwt.claims', true)::json->>'sub');

CREATE POLICY IF NOT EXISTS "System can manage all usage" ON usage_tracking
    FOR ALL USING (current_setting('role') = 'service_role');

-- Function to increment feature usage
CREATE OR REPLACE FUNCTION increment_feature_usage(p_clerk_id TEXT, p_feature TEXT)
RETURNS VOID AS $$
BEGIN
    -- Insert or update usage tracking
    INSERT INTO usage_tracking (clerk_id, user_id)
    VALUES (p_clerk_id, p_clerk_id)
    ON CONFLICT (clerk_id) DO NOTHING;

    -- Increment the specific feature count
    CASE p_feature
        WHEN 'numerology_count' THEN
            UPDATE usage_tracking
            SET numerology_count = numerology_count + 1,
                updated_at = NOW()
            WHERE clerk_id = p_clerk_id;
        WHEN 'love_match_count' THEN
            UPDATE usage_tracking
            SET love_match_count = love_match_count + 1,
                updated_at = NOW()
            WHERE clerk_id = p_clerk_id;
        WHEN 'trust_assessment_count' THEN
            UPDATE usage_tracking
            SET trust_assessment_count = trust_assessment_count + 1,
                updated_at = NOW()
            WHERE clerk_id = p_clerk_id;
    END CASE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to reset usage (called monthly)
CREATE OR REPLACE FUNCTION reset_user_usage(p_clerk_id TEXT)
RETURNS VOID AS $$
BEGIN
    UPDATE usage_tracking
    SET
        numerology_count = 0,
        love_match_count = 0,
        trust_assessment_count = 0,
        reset_date = NOW(),
        updated_at = NOW()
    WHERE clerk_id = p_clerk_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get user subscription with usage
CREATE OR REPLACE FUNCTION get_user_subscription_with_usage(p_clerk_id TEXT)
RETURNS TABLE (
    -- Subscription fields
    subscription_id UUID,
    tier TEXT,
    status TEXT,
    stripe_customer_id TEXT,
    stripe_subscription_id TEXT,
    current_period_start TIMESTAMP WITH TIME ZONE,
    current_period_end TIMESTAMP WITH TIME ZONE,
    cancel_at_period_end BOOLEAN,
    -- Usage fields
    numerology_count INTEGER,
    love_match_count INTEGER,
    trust_assessment_count INTEGER,
    reset_date TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        s.id as subscription_id,
        s.tier,
        s.status,
        s.stripe_customer_id,
        s.stripe_subscription_id,
        s.current_period_start,
        s.current_period_end,
        s.cancel_at_period_end,
        COALESCE(u.numerology_count, 0) as numerology_count,
        COALESCE(u.love_match_count, 0) as love_match_count,
        COALESCE(u.trust_assessment_count, 0) as trust_assessment_count,
        COALESCE(u.reset_date, NOW()) as reset_date
    FROM user_subscriptions s
    LEFT JOIN usage_tracking u ON s.clerk_id = u.clerk_id
    WHERE s.clerk_id = p_clerk_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER IF NOT EXISTS update_user_subscriptions_updated_at
    BEFORE UPDATE ON user_subscriptions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER IF NOT EXISTS update_usage_tracking_updated_at
    BEFORE UPDATE ON usage_tracking
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();