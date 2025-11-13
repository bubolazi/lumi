class UserStorageModel {
    constructor() {
        this.USERS_KEY = 'lumi_users';
        this.CURRENT_USER_KEY = 'lumi_current_user';
        
        this.supabaseConfig = typeof SupabaseConfig !== 'undefined' 
            ? new SupabaseConfig() 
            : null;
        
        this.supabaseStorage = this.supabaseConfig && this.supabaseConfig.isEnabled()
            ? new SupabaseStorageModel(this.supabaseConfig)
            : null;
        
        if (this.supabaseStorage && this.supabaseStorage.isAvailable()) {
            console.log('UserStorageModel: Using Supabase backend');
        } else {
            console.log('UserStorageModel: Using localStorage backend');
        }
    }
    
    getCurrentUser() {
        return sessionStorage.getItem(this.CURRENT_USER_KEY);
    }
    
    async setCurrentUser(username, password) {
        if (!username || username.trim() === '') {
            return false;
        }
        const trimmedUsername = username.trim();
        
        if (this.supabaseStorage && this.supabaseStorage.isAvailable() && password && password.trim() !== '') {
            return await this.supabaseStorage.setCurrentUser(trimmedUsername, password);
        }
        
        sessionStorage.setItem(this.CURRENT_USER_KEY, trimmedUsername);
        sessionStorage.setItem('lumi_use_local_only', 'true');
        
        if (!this.userExists(trimmedUsername)) {
            this.createUser(trimmedUsername);
        }
        return true;
    }
    
    logout() {
        if (this.supabaseStorage && this.supabaseStorage.isAvailable()) {
            this.supabaseStorage.logout();
        } else {
            sessionStorage.removeItem(this.CURRENT_USER_KEY);
            sessionStorage.removeItem('lumi_use_local_only');
        }
    }
    
    getAllUsers() {
        const usersData = localStorage.getItem(this.USERS_KEY);
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
    
    saveAllUsers(users) {
        try {
            localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
            return true;
        } catch (e) {
            console.error('Error saving users data:', e);
            return false;
        }
    }
    
    userExists(username) {
        const users = this.getAllUsers();
        return users.hasOwnProperty(username);
    }
    
    createUser(username) {
        const users = this.getAllUsers();
        users[username] = {
            badges: [],
            createdAt: new Date().toISOString()
        };
        return this.saveAllUsers(users);
    }
    
    getUserData(username) {
        const users = this.getAllUsers();
        return users[username] || null;
    }
    
    async addBadge(username, badgeName, badgeEmoji = '') {
        const useLocalOnly = sessionStorage.getItem('lumi_use_local_only') === 'true';
        
        if (this.supabaseStorage && this.supabaseStorage.isAvailable() && !useLocalOnly) {
            return await this.supabaseStorage.addBadge(username, badgeName, badgeEmoji);
        }
        
        let users = this.getAllUsers();
        if (!users[username]) {
            this.createUser(username);
            users = this.getAllUsers();
        }
        
        if (!users[username].badges) {
            users[username].badges = [];
        }
        
        const badgeData = {
            name: badgeName,
            emoji: badgeEmoji,
            earnedAt: new Date().toISOString()
        };
        
        users[username].badges.push(badgeData);
        return this.saveAllUsers(users);
    }
    
    async getBadges(username) {
        const useLocalOnly = sessionStorage.getItem('lumi_use_local_only') === 'true';
        
        if (this.supabaseStorage && this.supabaseStorage.isAvailable() && !useLocalOnly) {
            return await this.supabaseStorage.getBadges(username);
        }
        
        const userData = this.getUserData(username);
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
    
    async getBadgeCount(username) {
        const useLocalOnly = sessionStorage.getItem('lumi_use_local_only') === 'true';
        
        if (this.supabaseStorage && this.supabaseStorage.isAvailable() && !useLocalOnly) {
            return await this.supabaseStorage.getBadgeCount(username);
        }
        
        const badges = await this.getBadges(username);
        return badges.length;
    }
}
