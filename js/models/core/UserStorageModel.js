class UserStorageModel {
    constructor() {
        this.USERS_KEY = 'lumi_users';
        this.CURRENT_USER_KEY = 'lumi_current_user';
    }
    
    getCurrentUser() {
        return sessionStorage.getItem(this.CURRENT_USER_KEY);
    }
    
    setCurrentUser(username) {
        if (!username || username.trim() === '') {
            return false;
        }
        const trimmedUsername = username.trim();
        sessionStorage.setItem(this.CURRENT_USER_KEY, trimmedUsername);
        
        if (!this.userExists(trimmedUsername)) {
            this.createUser(trimmedUsername);
        }
        return true;
    }
    
    logout() {
        sessionStorage.removeItem(this.CURRENT_USER_KEY);
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
    
    addBadge(username, badgeName, badgeEmoji = '') {
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
    
    getBadges(username) {
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
    
    getBadgeCount(username) {
        return this.getBadges(username).length;
    }
}
