# Supabase Implementation - Setup Checklist

This checklist helps you set up and verify the Supabase integration for the Lumi application.

## ✅ Prerequisites Checklist

- [ ] Node.js installed (v18+ recommended)
- [ ] Modern web browser (Chrome, Firefox, Safari, Edge)
- [ ] Supabase account (free tier available at [supabase.com](https://supabase.com))

## 📋 Setup Steps

### 1. Install Dependencies

```bash
cd /path/to/lumi
npm install
```

**Verify**: Check that `@supabase/supabase-js` appears in `package.json` dependencies.

### 2. Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Sign up or log in
3. Click **"New Project"**
4. Fill in project details:
   - **Name**: `lumi-learning` (or your choice)
   - **Database Password**: Generate and save securely
   - **Region**: Choose closest to your users
   - **Plan**: Free tier (sufficient for most use cases)
5. Wait for project initialization (~2 minutes)

**Verify**: You should see the project dashboard.

### 3. Execute Database Schema

1. In Supabase dashboard, go to **SQL Editor**
2. Click **"New Query"**
3. Open `docs/supabase-schema.sql` from this repository
4. Copy entire contents and paste into query editor
5. Click **"Run"** or press `Ctrl+Enter` / `Cmd+Enter`
6. Wait for completion (should see success messages)

**Verify**: Check these were created:
- Tables: `users`, `badges`, `user_progress`
- Functions: `get_or_create_user`, `get_badge_count`, etc.
- Views: `leaderboard`, `user_stats_summary`

### 4. Get API Credentials

1. In Supabase dashboard, go to **Project Settings** > **API**
2. Find and copy:
   - **Project URL** (looks like `https://xxxx.supabase.co`)
   - **anon public** key (long string starting with `eyJ...`)

**Note**: The `anon` key is safe to commit - it's protected by Row Level Security.

### 5. Configure Application

1. Open `js/config/SupabaseConfig.js`
2. Update these values:
   ```javascript
   this.supabaseUrl = 'https://YOUR_PROJECT.supabase.co';
   this.supabaseAnonKey = 'YOUR_ANON_KEY_HERE';
   this.enabled = true;
   ```
3. Save the file

**Verify**: Open browser console and run:
```javascript
const config = new SupabaseConfig();
console.log('Enabled:', config.isEnabled()); // Should be true
```

### 6. Test the Integration

#### Option A: Automated Tests

```bash
npm test
```

**Expected**: All 120 tests should pass, including:
- 11 user storage tests
- 27 Supabase integration tests
- 82 other tests

#### Option B: Manual Browser Test

1. Start a local server:
   ```bash
   python3 -m http.server 8000
   # or
   npx serve .
   ```

2. Open `http://localhost:8000` in browser

3. Open browser console (F12) and run:
   ```javascript
   // Test connection
   const testSupabase = async () => {
       const user = 'TestUser' + Date.now();
       
       console.log('1. Creating user...');
       await window.lumiApp.userStorage.setCurrentUser(user);
       
       console.log('2. Adding badge...');
       await window.lumiApp.userStorage.addBadge(user, 'Test Badge', '🎯');
       
       console.log('3. Getting badges...');
       const badges = await window.lumiApp.userStorage.getBadges(user);
       console.log('✓ Success! Badge count:', badges.length);
       
       console.log('4. Logging out...');
       window.lumiApp.userStorage.logout();
       console.log('✓ Test complete!');
   };
   
   testSupabase();
   ```

**Expected**: Should see success messages and badge count of 1.

### 7. Verify in Supabase Dashboard

1. Go to **Table Editor** in Supabase dashboard
2. Click on **users** table
   - Should see the test user created
3. Click on **badges** table
   - Should see the test badge

**Verify**: Data appears in Supabase tables.

## 🔍 Troubleshooting

### Issue: Tests Failing

**Solution**:
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install
npm test
```

### Issue: "Supabase is not configured" Warning

**Check**:
1. Is `enabled` set to `true` in `SupabaseConfig.js`?
2. Are `supabaseUrl` and `supabaseAnonKey` filled in?
3. Did you reload the page after making changes?

### Issue: "Failed to initialize Supabase client"

**Check**:
1. Is the Supabase client CDN script loading in `index.html`?
2. Are there any browser console errors?
3. Is your internet connection working?

### Issue: Database Errors

**Check**:
1. Did you run the entire `supabase-schema.sql` file?
2. Are there any errors in the SQL execution?
3. Check Supabase **Logs** section for error details

### Issue: Data Not Syncing

**Check**:
1. Open browser console - are there any errors?
2. Check network tab - are requests going to Supabase?
3. Verify RLS policies are set correctly in database
4. Try clearing browser cache and localStorage

## 📊 Verification Checklist

After setup, verify these work:

- [ ] User can be created (check `users` table in Supabase)
- [ ] Badge can be added (check `badges` table in Supabase)
- [ ] Badges can be retrieved
- [ ] Badge count is correct
- [ ] Logout clears session
- [ ] Data persists after page reload
- [ ] Fallback to localStorage works (test by disabling Supabase)

## 🔒 Security Verification

- [ ] Only `anon` key is in code (never `service_role`)
- [ ] RLS policies are enabled on all tables
- [ ] Database password is stored securely (not in code)
- [ ] No console errors or warnings in production

## 📈 Monitor Usage

Check your Supabase usage regularly:

1. Go to **Database** > **Usage** in Supabase dashboard
2. Monitor:
   - Database size (500MB free tier limit)
   - API requests
   - Active users
3. Set up alerts if approaching limits

## 🎉 Success!

Once all checks pass:
- ✅ Supabase integration is working
- ✅ Data is syncing to cloud
- ✅ localStorage fallback is ready
- ✅ Application is production-ready

## 📚 Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Full Integration Guide](docs/SUPABASE_INTEGRATION_GUIDE.md)
- [Quick Start Guide](docs/SUPABASE_QUICK_START.md)
- [Database Schema](docs/supabase-schema.sql)

## 🆘 Getting Help

If you encounter issues:
1. Check browser console for errors
2. Review Supabase dashboard logs
3. Verify configuration in `SupabaseConfig.js`
4. Check network connectivity
5. Refer to troubleshooting section above

---

**Last Updated**: 2024-11-12  
**Version**: 1.0  
**Status**: Production Ready ✅
