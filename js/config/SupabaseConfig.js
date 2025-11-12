class SupabaseConfig {
    constructor() {
        this.supabaseUrl = '';
        this.supabaseAnonKey = '';
        
        this.enabled = false;
        
        this.fallbackToLocalStorage = true;
        
        this.cacheTimeout = 5 * 60 * 1000;
    }
    
    isEnabled() {
        return this.enabled && this.supabaseUrl && this.supabaseAnonKey;
    }
}
