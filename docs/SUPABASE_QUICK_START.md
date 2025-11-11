# Supabase Integration - Quick Start Guide

This is a condensed version of the full integration guide for developers who want to get started quickly.

## Prerequisites

- Supabase account (free tier is sufficient)
- Node.js and npm installed
- Basic understanding of async/await in JavaScript

## Quick Setup (30 minutes)

### 1. Create Supabase Project (5 minutes)

1. Go to [supabase.com](https://supabase.com) and sign up/login
2. Click "New Project"
3. Fill in:
   - **Name**: `lumi-learning`
   - **Database Password**: Generate strong password (save it!)
   - **Region**: Choose closest to your users
4. Wait for project to initialize (~2 minutes)
5. Go to **Settings > API** and copy:
   - **Project URL**: `https://xxxx.supabase.co`
   - **anon public key**: `eyJhbG...`

### 2. Setup Database Schema (10 minutes)

1. In Supabase Dashboard, go to **SQL Editor**
2. Click **New Query**
3. Copy the entire contents of `docs/supabase-schema.sql`
4. Paste and click **Run**
5. Verify success messages appear at the bottom

### 3. Install Supabase Client (2 minutes)

```bash
cd /path/to/lumi
npm install @supabase/supabase-js --save
```

### 4. Configure Application (5 minutes)

Create `js/config/supabase-config.js`:

```javascript
class SupabaseConfig {
    constructor() {
        this.supabaseUrl = 'https://your-project.supabase.co';  // ← Your Project URL
        this.supabaseAnonKey = 'your-anon-key-here';             // ← Your anon key
        this.enabled = true;
        this.fallbackToLocalStorage = true;
        this.cacheTimeout = 5 * 60 * 1000;
    }
    
    isEnabled() {
        return this.enabled && this.supabaseUrl && this.supabaseAnonKey;
    }
}
```

**Important**: Add to `.gitignore`:
```
js/config/supabase-config.js
```

### 5. Test Connection (5 minutes)

Open browser console on your app and run:

```javascript
// Test Supabase connection
const testConnection = async () => {
    const config = new SupabaseConfig();
    const client = supabase.createClient(config.supabaseUrl, config.supabaseAnonKey);
    
    // Try to fetch users
    const { data, error } = await client.from('users').select('*').limit(1);
    
    if (error) {
        console.error('Connection failed:', error);
    } else {
        console.log('✓ Connection successful!', data);
    }
};

testConnection();
```

## Current Implementation Status

### What Works Now (localStorage)

✅ User creation and login  
✅ Badge earning and storage  
✅ Data persistence in browser  
✅ 90 passing tests

### What Needs Implementation

📋 Create `SupabaseStorageModel.js`  
📋 Update `UserStorageModel.js` to use Supabase  
📋 Add Supabase client to HTML  
📋 Create migration utility  
📋 Update tests for Supabase

## Implementation Checklist

Follow the full guide in `docs/SUPABASE_INTEGRATION_GUIDE.md` for detailed implementation:

- [ ] **Phase 1**: Setup and Configuration (1-2 hours)
  - [ ] Install Supabase client library
  - [ ] Create configuration file
  - [ ] Update .gitignore

- [ ] **Phase 2**: Create SupabaseStorageModel (3-4 hours)
  - [ ] Create `js/models/core/SupabaseStorageModel.js`
  - [ ] Implement all storage methods
  - [ ] Add caching logic
  - [ ] Add fallback to localStorage

- [ ] **Phase 3**: Update UserStorageModel (2-3 hours)
  - [ ] Modify to use SupabaseStorageModel when available
  - [ ] Keep backward compatibility
  - [ ] Handle async operations

- [ ] **Phase 4**: Update HTML (30 minutes)
  - [ ] Add Supabase client script tag
  - [ ] Add config and model script tags
  - [ ] Verify load order

- [ ] **Phase 5**: Data Migration (2-3 hours)
  - [ ] Create migration utility
  - [ ] Add migration UI
  - [ ] Test migration process

- [ ] **Phase 6**: Testing (3-4 hours)
  - [ ] Create mock Supabase client
  - [ ] Update existing tests
  - [ ] Add new integration tests
  - [ ] Ensure all tests pass

- [ ] **Phase 7**: Deployment (2-3 hours)
  - [ ] Test in staging
  - [ ] Gradual rollout
  - [ ] Monitor metrics

## Code Examples

### Creating a User

```javascript
// Using SupabaseStorageModel
const storage = new SupabaseStorageModel(config);
await storage.setCurrentUser('Петър');
```

### Adding a Badge

```javascript
await storage.addBadge('Петър', 'Смело Мече', '🐻');
```

### Getting Badges

```javascript
const badges = await storage.getBadges('Петър');
console.log(`User has ${badges.length} badges`);
```

## Database Schema Overview

### Tables

1. **users**: User profiles
   - id (UUID)
   - username (unique)
   - created_at, updated_at, last_login_at

2. **badges**: Earned badges
   - id (UUID)
   - user_id (FK to users)
   - badge_name, badge_emoji
   - earned_at
   - subject, activity, level (optional metadata)

3. **user_progress**: Detailed statistics (optional)
   - id (UUID)
   - user_id (FK to users)
   - subject, activity, level
   - problems_solved, correct_answers, total_score

### Key Functions

- `get_or_create_user(username)`: Gets or creates user, returns UUID
- `get_badge_count(user_id)`: Returns badge count
- `get_user_stats(user_id)`: Returns comprehensive statistics
- `get_leaderboard(limit)`: Returns top users by badge count

## Testing

### Run Existing Tests

```bash
npm test
```

All 90 tests should pass before and after integration.

### Test with Supabase

```javascript
// In browser console
const testSupabase = async () => {
    const user = 'TestUser' + Date.now();
    
    // Create user
    await window.lumiApp.userStorage.setCurrentUser(user);
    console.log('✓ User created');
    
    // Add badge
    await window.lumiApp.userStorage.addBadge(user, 'Test Badge', '🎯');
    console.log('✓ Badge added');
    
    // Get badges
    const badges = await window.lumiApp.userStorage.getBadges(user);
    console.log('✓ Badges retrieved:', badges.length);
    
    // Logout
    await window.lumiApp.userStorage.logout();
    console.log('✓ Logged out');
};

testSupabase();
```

## Common Issues

### Connection Errors

**Problem**: "Failed to initialize Supabase client"  
**Solution**: 
1. Check URL and key are correct
2. Verify Supabase project is active
3. Check browser console for CORS errors

### Data Not Syncing

**Problem**: Changes don't appear on other devices  
**Solution**:
1. Verify same username is used
2. Clear cache if needed
3. Check Supabase dashboard for data

### Tests Failing

**Problem**: Tests fail after integration  
**Solution**:
1. Ensure mock client is set up
2. Check async/await usage
3. Verify test setup includes dependencies

## Monitoring

### Check Supabase Usage

1. Go to Supabase Dashboard
2. Click **Database** > **Usage**
3. Monitor:
   - Database size (500MB limit on free tier)
   - API requests
   - Active users

### Free Tier Limits

- **Database**: 500 MB (can store ~166,000 users)
- **Storage**: 1 GB
- **Bandwidth**: 2 GB/month
- **Monthly Active Users**: 50,000

## Next Steps

1. ✅ Read this quick start guide
2. 📖 Read full guide: `docs/SUPABASE_INTEGRATION_GUIDE.md`
3. 🗄️ Execute schema: `docs/supabase-schema.sql`
4. 💻 Start implementation: Phase 1 → Phase 7
5. ✅ Test thoroughly at each phase
6. 🚀 Deploy gradually with monitoring

## Resources

- **Full Guide**: `docs/SUPABASE_INTEGRATION_GUIDE.md`
- **Database Schema**: `docs/supabase-schema.sql`
- **Supabase Docs**: [supabase.com/docs](https://supabase.com/docs)
- **JS Client Docs**: [supabase.com/docs/reference/javascript](https://supabase.com/docs/reference/javascript)

## Support

For issues or questions:
1. Check the full integration guide
2. Review Supabase documentation
3. Check browser console for errors
4. Review Supabase dashboard logs

---

**Estimated Total Time**: 14-21 hours  
**Skill Level**: Intermediate JavaScript + Basic SQL  
**Status**: Ready to implement
