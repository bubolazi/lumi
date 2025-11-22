# Supabase Configuration Example

## Copy this file to `js/config/SupabaseConfig.js` and replace with your actual values

Copy the template below:

```javascript
class SupabaseConfig {
    constructor() {
        // Replace these with your Supabase project credentials
        // Get these from: Project Settings > API in your Supabase dashboard
        this.supabaseUrl = 'https://your-project-id.supabase.co';
        this.supabaseAnonKey = 'your-anon-public-key-here';
        
        // Set to true to enable Supabase
        this.enabled = true;
        
        // Fallback to localStorage if Supabase fails
        this.fallbackToLocalStorage = true;
        
        // Cache timeout (5 minutes)
        this.cacheTimeout = 5 * 60 * 1000;
    }
    
    isEnabled() {
        return this.enabled && this.supabaseUrl && this.supabaseAnonKey;
    }
}
```

## How to Get Your Credentials

1. Go to [supabase.com](https://supabase.com) and create a free account
2. Create a new project
3. Wait for the project to finish setting up (~2 minutes)
4. Go to **Project Settings** > **API**
5. Copy:
   - **Project URL** → paste into `supabaseUrl`
   - **anon public** key → paste into `supabaseAnonKey`

## Security Note

**The `anon` key is safe to commit and expose in your code!**

- It's protected by Row Level Security (RLS) policies
- Rate limited by Supabase
- Designed to be public

**Never expose the `service_role` key** - that one should only be used in server environments.

## Testing Your Configuration

Open your browser console and run:

```javascript
const config = new SupabaseConfig();
console.log('Supabase enabled:', config.isEnabled());
```

If it returns `true`, you're good to go!
