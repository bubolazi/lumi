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
    
    addBadge(username, badgeMessage) {
        let users = this.getAllUsers();
        if (!users[username]) {
            this.createUser(username);
            users = this.getAllUsers();
        }
        
        const badge = {
            message: badgeMessage,
            timestamp: new Date().toISOString()
        };
        
        if (!users[username].badges) {
            users[username].badges = [];
        }
        
        users[username].badges.push(badge);
        return this.saveAllUsers(users);
    }
    
    getBadges(username) {
        const userData = this.getUserData(username);
        return userData ? userData.badges || [] : [];
    }
    
    getBadgeCount(username) {
        return this.getBadges(username).length;
    }
}
