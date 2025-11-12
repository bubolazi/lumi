-- ============================================================================
-- Lumi Learning Application - Supabase Database Schema
-- ============================================================================
-- This script creates all necessary tables, indexes, policies, and functions
-- for the Lumi learning application with Supabase integration.
-- 
-- Execute this script in your Supabase SQL Editor:
-- 1. Go to your Supabase project dashboard
-- 2. Navigate to SQL Editor
-- 3. Create a new query
-- 4. Paste and run this entire script
-- ============================================================================

-- ============================================================================
-- 1. USERS TABLE
-- ============================================================================
-- Stores user profiles and account information

CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username TEXT UNIQUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    last_login_at TIMESTAMPTZ,
    
    -- Optional fields for future enhancements
    email TEXT,
    display_name TEXT,
    
    -- Constraints
    CONSTRAINT username_length CHECK (char_length(username) >= 1 AND char_length(username) <= 50),
    CONSTRAINT username_no_spaces CHECK (username !~ '\s')
);

-- Create indexes for faster lookups
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at DESC);

-- Add comment for documentation
COMMENT ON TABLE users IS 'Stores user profiles for the Lumi learning application';
COMMENT ON COLUMN users.username IS 'Unique username (1-50 characters, no spaces)';
COMMENT ON COLUMN users.created_at IS 'Timestamp when user account was created';
COMMENT ON COLUMN users.last_login_at IS 'Timestamp of most recent login';

-- ============================================================================
-- 2. BADGES TABLE
-- ============================================================================
-- Stores all badges earned by users

CREATE TABLE IF NOT EXISTS badges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    badge_name TEXT NOT NULL,
    badge_emoji TEXT NOT NULL DEFAULT '⭐',
    earned_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Additional metadata for future features
    subject TEXT,
    activity TEXT,
    level INTEGER,
    
    -- Constraints
    CONSTRAINT badge_name_length CHECK (char_length(badge_name) >= 1 AND char_length(badge_name) <= 200),
    CONSTRAINT badge_emoji_length CHECK (char_length(badge_emoji) <= 10)
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_badges_user_id ON badges(user_id);
CREATE INDEX IF NOT EXISTS idx_badges_earned_at ON badges(earned_at DESC);
CREATE INDEX IF NOT EXISTS idx_badges_subject ON badges(subject);
CREATE INDEX IF NOT EXISTS idx_badges_activity ON badges(activity);

-- Add comments for documentation
COMMENT ON TABLE badges IS 'Stores badges earned by users in learning activities';
COMMENT ON COLUMN badges.user_id IS 'Reference to the user who earned this badge';
COMMENT ON COLUMN badges.badge_name IS 'Name/description of the badge';
COMMENT ON COLUMN badges.badge_emoji IS 'Emoji icon for the badge';
COMMENT ON COLUMN badges.earned_at IS 'Timestamp when badge was earned';
COMMENT ON COLUMN badges.subject IS 'Subject area (math, bulgarian, etc.)';
COMMENT ON COLUMN badges.activity IS 'Specific activity where badge was earned';
COMMENT ON COLUMN badges.level IS 'Difficulty level where badge was earned';

-- ============================================================================
-- 3. USER PROGRESS TABLE (Optional - for future enhancements)
-- ============================================================================
-- Tracks detailed progress statistics per user/subject/activity/level

CREATE TABLE IF NOT EXISTS user_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    subject TEXT NOT NULL,
    activity TEXT NOT NULL,
    level INTEGER NOT NULL,
    problems_solved INTEGER DEFAULT 0,
    correct_answers INTEGER DEFAULT 0,
    total_score INTEGER DEFAULT 0,
    last_played_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Ensure one progress record per user/subject/activity/level combination
    UNIQUE(user_id, subject, activity, level),
    
    -- Constraints
    CONSTRAINT problems_solved_non_negative CHECK (problems_solved >= 0),
    CONSTRAINT correct_answers_non_negative CHECK (correct_answers >= 0),
    CONSTRAINT correct_not_greater_than_solved CHECK (correct_answers <= problems_solved),
    CONSTRAINT total_score_non_negative CHECK (total_score >= 0)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_user_progress_user_id ON user_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_last_played ON user_progress(last_played_at DESC);
CREATE INDEX IF NOT EXISTS idx_user_progress_subject ON user_progress(subject);

-- Add comments
COMMENT ON TABLE user_progress IS 'Tracks detailed progress statistics for each user';
COMMENT ON COLUMN user_progress.problems_solved IS 'Total number of problems attempted';
COMMENT ON COLUMN user_progress.correct_answers IS 'Number of correct answers';
COMMENT ON COLUMN user_progress.total_score IS 'Cumulative score earned';

-- ============================================================================
-- 4. ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================
-- Enable Row Level Security for all tables

-- Users table RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can read user profiles (for leaderboards, etc.)
CREATE POLICY "Users can read all profiles"
    ON users FOR SELECT
    USING (true);

-- Policy: Anyone can create a new user profile
CREATE POLICY "Users can create profiles"
    ON users FOR INSERT
    WITH CHECK (true);

-- Policy: Anyone can update any user profile
-- Note: In production, you might want to restrict this to authenticated users
CREATE POLICY "Users can update profiles"
    ON users FOR UPDATE
    USING (true);

-- Badges table RLS
ALTER TABLE badges ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can read badges (for viewing other users' achievements)
CREATE POLICY "Badges are publicly readable"
    ON badges FOR SELECT
    USING (true);

-- Policy: Anyone can insert badges
-- Note: In production, consider adding authentication checks
CREATE POLICY "Users can create badges"
    ON badges FOR INSERT
    WITH CHECK (true);

-- Note: No UPDATE or DELETE policies for badges - they are permanent achievements

-- User Progress table RLS
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can read progress data
CREATE POLICY "Progress is publicly readable"
    ON user_progress FOR SELECT
    USING (true);

-- Policy: Anyone can manage progress
CREATE POLICY "Users can manage progress"
    ON user_progress FOR ALL
    USING (true);

-- ============================================================================
-- 5. DATABASE FUNCTIONS
-- ============================================================================

-- Function: Get or create user by username
-- Returns the user ID, creating the user if they don't exist
CREATE OR REPLACE FUNCTION get_or_create_user(p_username TEXT)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_user_id UUID;
BEGIN
    -- Validate username
    IF p_username IS NULL OR trim(p_username) = '' THEN
        RAISE EXCEPTION 'Username cannot be empty';
    END IF;
    
    IF char_length(trim(p_username)) > 50 THEN
        RAISE EXCEPTION 'Username too long (max 50 characters)';
    END IF;
    
    -- Try to get existing user
    SELECT id INTO v_user_id
    FROM users
    WHERE username = trim(p_username);
    
    -- If user doesn't exist, create it
    IF v_user_id IS NULL THEN
        INSERT INTO users (username, created_at, last_login_at)
        VALUES (trim(p_username), NOW(), NOW())
        RETURNING id INTO v_user_id;
        
        RAISE NOTICE 'Created new user: % (ID: %)', p_username, v_user_id;
    ELSE
        -- Update last login time
        UPDATE users
        SET last_login_at = NOW(),
            updated_at = NOW()
        WHERE id = v_user_id;
        
        RAISE NOTICE 'Updated existing user: % (ID: %)', p_username, v_user_id;
    END IF;
    
    RETURN v_user_id;
END;
$$;

COMMENT ON FUNCTION get_or_create_user IS 'Gets existing user or creates new one, returns user ID';

-- Function: Get user badge count
CREATE OR REPLACE FUNCTION get_badge_count(p_user_id UUID)
RETURNS INTEGER
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
    SELECT COUNT(*)::INTEGER
    FROM badges
    WHERE user_id = p_user_id;
$$;

COMMENT ON FUNCTION get_badge_count IS 'Returns total number of badges earned by a user';

-- Function: Get user statistics
CREATE OR REPLACE FUNCTION get_user_stats(p_user_id UUID)
RETURNS TABLE (
    total_badges INTEGER,
    subjects_played INTEGER,
    total_problems_solved INTEGER,
    total_correct_answers INTEGER,
    total_score INTEGER,
    accuracy_percentage NUMERIC(5,2)
)
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
    SELECT 
        COUNT(DISTINCT b.id)::INTEGER as total_badges,
        COUNT(DISTINCT up.subject)::INTEGER as subjects_played,
        COALESCE(SUM(up.problems_solved), 0)::INTEGER as total_problems_solved,
        COALESCE(SUM(up.correct_answers), 0)::INTEGER as total_correct_answers,
        COALESCE(SUM(up.total_score), 0)::INTEGER as total_score,
        CASE 
            WHEN COALESCE(SUM(up.problems_solved), 0) > 0 
            THEN ROUND((COALESCE(SUM(up.correct_answers), 0)::NUMERIC / 
                       COALESCE(SUM(up.problems_solved), 0)::NUMERIC * 100), 2)
            ELSE 0
        END as accuracy_percentage
    FROM users u
    LEFT JOIN badges b ON u.id = b.user_id
    LEFT JOIN user_progress up ON u.id = up.user_id
    WHERE u.id = p_user_id
    GROUP BY u.id;
$$;

COMMENT ON FUNCTION get_user_stats IS 'Returns comprehensive statistics for a user';

-- Function: Get leaderboard
CREATE OR REPLACE FUNCTION get_leaderboard(p_limit INTEGER DEFAULT 100)
RETURNS TABLE (
    rank BIGINT,
    username TEXT,
    badge_count BIGINT,
    total_score BIGINT,
    created_at TIMESTAMPTZ
)
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
    SELECT 
        ROW_NUMBER() OVER (ORDER BY COUNT(b.id) DESC, u.created_at ASC) as rank,
        u.username,
        COUNT(b.id) as badge_count,
        COALESCE(SUM(up.total_score), 0) as total_score,
        u.created_at
    FROM users u
    LEFT JOIN badges b ON u.id = b.user_id
    LEFT JOIN user_progress up ON u.id = up.user_id
    GROUP BY u.id, u.username, u.created_at
    ORDER BY badge_count DESC, u.created_at ASC
    LIMIT p_limit;
$$;

COMMENT ON FUNCTION get_leaderboard IS 'Returns top users ranked by badge count';

-- Function: Update or insert user progress (upsert)
CREATE OR REPLACE FUNCTION upsert_user_progress(
    p_user_id UUID,
    p_subject TEXT,
    p_activity TEXT,
    p_level INTEGER,
    p_problems_solved INTEGER,
    p_correct_answers INTEGER,
    p_score INTEGER
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_progress_id UUID;
BEGIN
    -- Insert or update progress record
    INSERT INTO user_progress (
        user_id, subject, activity, level,
        problems_solved, correct_answers, total_score,
        last_played_at, updated_at
    )
    VALUES (
        p_user_id, p_subject, p_activity, p_level,
        p_problems_solved, p_correct_answers, p_score,
        NOW(), NOW()
    )
    ON CONFLICT (user_id, subject, activity, level)
    DO UPDATE SET
        problems_solved = user_progress.problems_solved + p_problems_solved,
        correct_answers = user_progress.correct_answers + p_correct_answers,
        total_score = user_progress.total_score + p_score,
        last_played_at = NOW(),
        updated_at = NOW()
    RETURNING id INTO v_progress_id;
    
    RETURN v_progress_id;
END;
$$;

COMMENT ON FUNCTION upsert_user_progress IS 'Creates or updates user progress record';

-- ============================================================================
-- 6. VIEWS
-- ============================================================================

-- View: User summary with statistics
CREATE OR REPLACE VIEW user_summary AS
SELECT 
    u.id,
    u.username,
    u.created_at,
    u.last_login_at,
    COUNT(DISTINCT b.id) as total_badges,
    COUNT(DISTINCT up.subject) as subjects_played,
    COALESCE(SUM(up.problems_solved), 0) as total_problems_solved,
    COALESCE(SUM(up.correct_answers), 0) as total_correct_answers,
    COALESCE(SUM(up.total_score), 0) as total_score,
    CASE 
        WHEN COALESCE(SUM(up.problems_solved), 0) > 0 
        THEN ROUND((COALESCE(SUM(up.correct_answers), 0)::NUMERIC / 
                   COALESCE(SUM(up.problems_solved), 0)::NUMERIC * 100), 2)
        ELSE 0
    END as accuracy_percentage
FROM users u
LEFT JOIN badges b ON u.id = b.user_id
LEFT JOIN user_progress up ON u.id = up.user_id
GROUP BY u.id, u.username, u.created_at, u.last_login_at;

COMMENT ON VIEW user_summary IS 'Comprehensive user statistics view';

-- View: Recent badges (last 100)
CREATE OR REPLACE VIEW recent_badges AS
SELECT 
    b.id,
    u.username,
    b.badge_name,
    b.badge_emoji,
    b.subject,
    b.activity,
    b.level,
    b.earned_at
FROM badges b
JOIN users u ON b.user_id = u.id
ORDER BY b.earned_at DESC
LIMIT 100;

COMMENT ON VIEW recent_badges IS 'Shows the 100 most recently earned badges';

-- ============================================================================
-- 7. TRIGGERS
-- ============================================================================

-- Trigger function: Update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;

-- Apply trigger to users table
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Apply trigger to user_progress table
CREATE TRIGGER update_user_progress_updated_at
    BEFORE UPDATE ON user_progress
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- 8. SAMPLE DATA (Optional - for testing)
-- ============================================================================

-- Uncomment the following to insert sample data for testing:

/*
-- Create sample users
INSERT INTO users (username, created_at) VALUES
    ('Петър', NOW() - INTERVAL '30 days'),
    ('Мария', NOW() - INTERVAL '20 days'),
    ('Иван', NOW() - INTERVAL '10 days'),
    ('София', NOW() - INTERVAL '5 days')
ON CONFLICT (username) DO NOTHING;

-- Get user IDs
DO $$
DECLARE
    v_petar_id UUID;
    v_maria_id UUID;
    v_ivan_id UUID;
    v_sofia_id UUID;
BEGIN
    SELECT id INTO v_petar_id FROM users WHERE username = 'Петър';
    SELECT id INTO v_maria_id FROM users WHERE username = 'Мария';
    SELECT id INTO v_ivan_id FROM users WHERE username = 'Иван';
    SELECT id INTO v_sofia_id FROM users WHERE username = 'София';
    
    -- Insert sample badges
    INSERT INTO badges (user_id, badge_name, badge_emoji, subject, activity, earned_at) VALUES
        (v_petar_id, 'Смело Мече', '🐻', 'math', 'addition', NOW() - INTERVAL '25 days'),
        (v_petar_id, 'Звездна Панда', '🐼', 'math', 'subtraction', NOW() - INTERVAL '20 days'),
        (v_petar_id, 'Космически Лъв', '🦁', 'bulgarian', 'letters', NOW() - INTERVAL '15 days'),
        (v_maria_id, 'Смело Мече', '🐻', 'math', 'addition', NOW() - INTERVAL '18 days'),
        (v_maria_id, 'Звездна Панда', '🐼', 'math', 'subtraction', NOW() - INTERVAL '12 days'),
        (v_ivan_id, 'Смело Мече', '🐻', 'math', 'addition', NOW() - INTERVAL '8 days'),
        (v_sofia_id, 'Смело Мече', '🐻', 'bulgarian', 'letters', NOW() - INTERVAL '3 days');
    
    -- Insert sample progress data
    INSERT INTO user_progress (user_id, subject, activity, level, problems_solved, correct_answers, total_score) VALUES
        (v_petar_id, 'math', 'addition', 1, 50, 45, 450),
        (v_petar_id, 'math', 'addition', 2, 30, 25, 250),
        (v_petar_id, 'math', 'subtraction', 1, 40, 35, 350),
        (v_maria_id, 'math', 'addition', 1, 60, 55, 550),
        (v_maria_id, 'bulgarian', 'letters', 1, 45, 40, 400),
        (v_ivan_id, 'math', 'addition', 1, 25, 20, 200),
        (v_sofia_id, 'bulgarian', 'letters', 1, 35, 32, 320);
END $$;

-- Verify sample data
SELECT 'Users created:' as info, COUNT(*) as count FROM users;
SELECT 'Badges created:' as info, COUNT(*) as count FROM badges;
SELECT 'Progress records:' as info, COUNT(*) as count FROM user_progress;
*/

-- ============================================================================
-- 9. VERIFICATION QUERIES
-- ============================================================================
-- Run these queries to verify the schema was created correctly

-- Check tables
SELECT 
    schemaname, 
    tablename, 
    tableowner 
FROM pg_tables 
WHERE schemaname = 'public' 
    AND tablename IN ('users', 'badges', 'user_progress')
ORDER BY tablename;

-- Check indexes
SELECT 
    schemaname, 
    tablename, 
    indexname 
FROM pg_indexes 
WHERE schemaname = 'public' 
    AND tablename IN ('users', 'badges', 'user_progress')
ORDER BY tablename, indexname;

-- Check functions
SELECT 
    routine_name,
    routine_type,
    data_type as return_type
FROM information_schema.routines
WHERE routine_schema = 'public'
    AND routine_name IN (
        'get_or_create_user',
        'get_badge_count',
        'get_user_stats',
        'get_leaderboard',
        'upsert_user_progress'
    )
ORDER BY routine_name;

-- Check views
SELECT 
    table_name,
    view_definition
FROM information_schema.views
WHERE table_schema = 'public'
    AND table_name IN ('user_summary', 'recent_badges')
ORDER BY table_name;

-- Check RLS policies
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- ============================================================================
-- 10. CLEANUP (Optional)
-- ============================================================================
-- Use these commands to drop everything if you need to start over

/*
-- Drop everything in reverse order
DROP VIEW IF EXISTS recent_badges CASCADE;
DROP VIEW IF EXISTS user_summary CASCADE;
DROP FUNCTION IF EXISTS upsert_user_progress CASCADE;
DROP FUNCTION IF EXISTS get_leaderboard CASCADE;
DROP FUNCTION IF EXISTS get_user_stats CASCADE;
DROP FUNCTION IF EXISTS get_badge_count CASCADE;
DROP FUNCTION IF EXISTS get_or_create_user CASCADE;
DROP FUNCTION IF EXISTS update_updated_at_column CASCADE;
DROP TABLE IF EXISTS user_progress CASCADE;
DROP TABLE IF EXISTS badges CASCADE;
DROP TABLE IF EXISTS users CASCADE;
*/

-- ============================================================================
-- END OF SCHEMA
-- ============================================================================

SELECT '✓ Schema creation complete!' as status;
SELECT '  → Tables: users, badges, user_progress' as info;
SELECT '  → Functions: get_or_create_user, get_badge_count, get_user_stats, get_leaderboard, upsert_user_progress' as info;
SELECT '  → Views: user_summary, recent_badges' as info;
SELECT '  → RLS: Enabled on all tables with appropriate policies' as info;
