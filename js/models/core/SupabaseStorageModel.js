class SupabaseStorageModel {
    constructor(config) {
        this.config = config;
        this.client = null;
        this.currentUserId = null;
        this.cache = {
            users: null,
            badges: null,
            lastUpdate: null
        };
        
        this.initializeClient();
    }
    
    initializeClient() {
        if (!this.config.isEnabled()) {
            console.warn('Supabase is not configured');
            return;
        }
        
        try {
            if (typeof supabase === 'undefined' || typeof supabase.createClient !== 'function') {
                console.warn('Supabase client library not loaded');
                this.client = null;
                return;
            }
            
            this.client = supabase.createClient(
                this.config.supabaseUrl,
                this.config.supabaseAnonKey
            );
            console.log('Supabase client initialized');
        } catch (error) {
            console.error('Failed to initialize Supabase client:', error);
            this.client = null;
        }
    }
    
    isAvailable() {
        return this.client !== null;
    }
    
    async getCurrentUser() {
        return sessionStorage.getItem('lumi_current_user');
    }
    
    async setCurrentUser(username, password) {
        if (!username || username.trim() === '') {
            return false;
        }
        
        const trimmedUsername = username.trim();
        
        if (password && password.trim() !== '') {
            try {
                const email = `${trimmedUsername.toLowerCase().replace(/\s+/g, '_')}@lumi.local`;
                
                let authResult = await this.client.auth.signInWithPassword({
                    email: email,
                    password: password
                });
                
                if (authResult.error) {
                    if (authResult.error.message.includes('Invalid login credentials')) {
                        authResult = await this.client.auth.signUp({
                            email: email,
                            password: password,
                            options: {
                                data: {
                                    username: trimmedUsername
                                }
                            }
                        });
                        
                        if (authResult.error) throw authResult.error;
                    } else {
                        throw authResult.error;
                    }
                }
                
                if (authResult.data && authResult.data.user) {
                    const { data, error } = await this.client
                        .rpc('get_or_create_user', { p_username: trimmedUsername });
                    
                    if (error) throw error;
                    
                    this.currentUserId = data;
                    sessionStorage.setItem('lumi_current_user', trimmedUsername);
                    sessionStorage.setItem('lumi_user_id', data);
                    sessionStorage.setItem('lumi_auth_user', authResult.data.user.id);
                    sessionStorage.removeItem('lumi_use_local_only');
                    
                    return true;
                }
                
                return false;
            } catch (error) {
                console.error('Error with password authentication:', error);
                
                if (this.config.fallbackToLocalStorage) {
                    sessionStorage.setItem('lumi_current_user', trimmedUsername);
                    sessionStorage.setItem('lumi_use_local_only', 'true');
                    return true;
                }
                
                return false;
            }
        }
        
        try {
            const { data, error } = await this.client
                .rpc('get_or_create_user', { p_username: trimmedUsername });
            
            if (error) throw error;
            
            this.currentUserId = data;
            sessionStorage.setItem('lumi_current_user', trimmedUsername);
            sessionStorage.setItem('lumi_user_id', data);
            sessionStorage.removeItem('lumi_use_local_only');
            
            return true;
        } catch (error) {
            console.error('Error setting current user:', error);
            
            if (this.config.fallbackToLocalStorage) {
                sessionStorage.setItem('lumi_current_user', trimmedUsername);
                sessionStorage.setItem('lumi_use_local_only', 'true');
                return true;
            }
            
            return false;
        }
    }
    
    async logout() {
        this.currentUserId = null;
        sessionStorage.removeItem('lumi_current_user');
        sessionStorage.removeItem('lumi_user_id');
        sessionStorage.removeItem('lumi_auth_user');
        sessionStorage.removeItem('lumi_use_local_only');
        this.clearCache();
        
        try {
            if (this.client) {
                await this.client.auth.signOut();
            }
        } catch (error) {
            console.error('Error signing out:', error);
        }
    }
    
    async addBadge(username, badgeName, badgeEmoji = '⭐') {
        try {
            const userId = await this.getUserId(username);
            if (!userId) {
                throw new Error('User not found');
            }
            
            const { data, error } = await this.client
                .from('badges')
                .insert([
                    {
                        user_id: userId,
                        badge_name: badgeName,
                        badge_emoji: badgeEmoji,
                        earned_at: new Date().toISOString()
                    }
                ]);
            
            if (error) throw error;
            
            this.clearCache();
            
            return true;
        } catch (error) {
            console.error('Error adding badge:', error);
            
            if (this.config.fallbackToLocalStorage) {
                return this.addBadgeToLocalStorage(username, badgeName, badgeEmoji);
            }
            
            return false;
        }
    }
    
    async getBadges(username) {
        try {
            if (this.isCacheValid()) {
                const cachedBadges = this.cache.badges?.[username];
                if (cachedBadges) return cachedBadges;
            }
            
            const userId = await this.getUserId(username);
            if (!userId) {
                return [];
            }
            
            const { data, error } = await this.client
                .from('badges')
                .select('badge_name, badge_emoji, earned_at')
                .eq('user_id', userId)
                .order('earned_at', { ascending: true });
            
            if (error) throw error;
            
            const badges = data.map(badge => ({
                name: badge.badge_name,
                emoji: badge.badge_emoji,
                earnedAt: badge.earned_at
            }));
            
            this.updateCache('badges', username, badges);
            
            return badges;
        } catch (error) {
            console.error('Error getting badges:', error);
            
            if (this.config.fallbackToLocalStorage) {
                return this.getBadgesFromLocalStorage(username);
            }
            
            return [];
        }
    }
    
    async getBadgeCount(username) {
        const badges = await this.getBadges(username);
        return badges.length;
    }
    
    async getUserId(username) {
        try {
            if (this.isCacheValid()) {
                const cachedId = this.cache.users?.[username];
                if (cachedId) return cachedId;
            }
            
            const { data, error } = await this.client
                .from('users')
                .select('id')
                .eq('username', username)
                .single();
            
            if (error) {
                if (error.code === 'PGRST116') {
                    return null;
                }
                throw error;
            }
            
            this.updateCache('users', username, data.id);
            
            return data.id;
        } catch (error) {
            console.error('Error getting user ID:', error);
            return null;
        }
    }
    
    isCacheValid() {
        if (!this.cache.lastUpdate) return false;
        const now = Date.now();
        return (now - this.cache.lastUpdate) < this.config.cacheTimeout;
    }
    
    updateCache(type, key, value) {
        if (!this.cache[type]) {
            this.cache[type] = {};
        }
        this.cache[type][key] = value;
        this.cache.lastUpdate = Date.now();
    }
    
    clearCache() {
        this.cache = {
            users: null,
            badges: null,
            lastUpdate: null
        };
    }
    
    addBadgeToLocalStorage(username, badgeName, badgeEmoji) {
        const users = this.getAllUsersFromLocalStorage();
        if (!users[username]) {
            users[username] = {
                badges: [],
                createdAt: new Date().toISOString()
            };
        }
        
        if (!users[username].badges) {
            users[username].badges = [];
        }
        
        users[username].badges.push({
            name: badgeName,
            emoji: badgeEmoji,
            earnedAt: new Date().toISOString()
        });
        
        localStorage.setItem('lumi_users', JSON.stringify(users));
        return true;
    }
    
    getBadgesFromLocalStorage(username) {
        const users = this.getAllUsersFromLocalStorage();
        const userData = users[username];
        
        if (!userData || !userData.badges) {
            return [];
        }
        
        return userData.badges.map(badge => {
            if (typeof badge === 'string') {
                return { name: badge, emoji: '', earnedAt: '' };
            }
            return badge;
        });
    }
    
    getAllUsersFromLocalStorage() {
        const usersData = localStorage.getItem('lumi_users');
        if (!usersData) {
            return {};
        }
        try {
            return JSON.parse(usersData);
        } catch (e) {
            console.error('Error parsing users data:', e);
            return {};
        }
    }
}
