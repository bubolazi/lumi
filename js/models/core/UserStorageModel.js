class UserStorageModel {
    constructor() {
        this.apiService = new ApiService();
        this.currentUser = null;
        this.isApiUser = false;

        this.USERS_KEY = 'lumi_users';
        this.CURRENT_USER_KEY = 'lumi_current_user';
        this.IS_API_USER_KEY = 'lumi_is_api_user';

        this.loadUserFromSession();
    }

    loadUserFromSession() {
        // Check if we have an API user session
        const apiUserData = sessionStorage.getItem('lumi_user');
        if (apiUserData) {
            try {
                this.currentUser = JSON.parse(apiUserData);
                this.isApiUser = true;
                return;
            } catch (e) {
                console.error('Failed to parse API user data', e);
                sessionStorage.removeItem('lumi_user');
            }
        }

        // Fallback to local user
        const localUser = sessionStorage.getItem(this.CURRENT_USER_KEY);
        if (localUser) {
            this.currentUser = { displayName: localUser };
            this.isApiUser = false;
        }
    }

    getCurrentUser() {
        if (!this.currentUser) return null;
        return this.currentUser.displayName || this.currentUser.email || 'User';
    }

    // Local Storage Methods (Legacy)
    getAllUsers() {
        const usersData = localStorage.getItem(this.USERS_KEY);
        if (!usersData) return {};
        try {
            return JSON.parse(usersData);
        } catch (e) {
            return {};
        }
    }

    saveAllUsers(users) {
        try {
            localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
            return true;
        } catch (e) {
            return false;
        }
    }

    setLocalUser(username) {
        if (!username || username.trim() === '') return false;
        const trimmedUsername = username.trim();

        // Clear API session if exists
        sessionStorage.removeItem('lumi_user');
        sessionStorage.removeItem('lumi_access_token');
        sessionStorage.removeItem('lumi_refresh_token');

        // Set local session
        sessionStorage.setItem(this.CURRENT_USER_KEY, trimmedUsername);
        sessionStorage.setItem(this.IS_API_USER_KEY, 'false');

        this.currentUser = { displayName: trimmedUsername };
        this.isApiUser = false;

        // Ensure user exists in local DB
        const users = this.getAllUsers();
        if (!users[trimmedUsername]) {
            users[trimmedUsername] = {
                badges: [],
                createdAt: new Date().toISOString()
            };
            this.saveAllUsers(users);
        }

        return true;
    }

    // API Methods
    async login(email, password, captchaToken) {
        try {
            const response = await this.apiService.login(email, password, captchaToken);
            if (response.success) {
                this.currentUser = response.user;
                this.isApiUser = true;
                // Clear local session key to avoid confusion
                sessionStorage.removeItem(this.CURRENT_USER_KEY);
                return { success: true };
            }
            return { success: false, error: response.message, userNotFound: response.userNotFound };
        } catch (e) {
            console.error('Login failed', e);
            return { success: false, error: e.message };
        }
    }

    async register(email, password, displayName, captchaToken) {
        try {
            const response = await this.apiService.register(email, password, displayName, captchaToken);
            if (response.success) {
                // If session is returned, we are logged in
                if (response.session) {
                    this.currentUser = response.user;
                    this.isApiUser = true;
                    sessionStorage.removeItem(this.CURRENT_USER_KEY);
                }
                return { success: true, session: !!response.session };
            }
            return { success: false, error: response.message };
        } catch (e) {
            console.error('Registration failed', e);
            return { success: false, error: e.message };
        }
    }

    logout() {
        if (this.isApiUser) {
            this.apiService.logout();
        }
        sessionStorage.removeItem(this.CURRENT_USER_KEY);
        sessionStorage.removeItem(this.IS_API_USER_KEY);
        this.currentUser = null;
        this.isApiUser = false;
    }

    async addBadge(badgeName, badgeEmoji = '') {
        if (!this.currentUser) return false;

        if (this.isApiUser) {
            try {
                await this.apiService.createBadge({ badge_name: badgeName, badge_emoji: badgeEmoji });
                return true;
            } catch (e) {
                console.error('Failed to add badge via API', e);
                return false;
            }
        } else {
            // Local storage logic
            const username = this.currentUser.displayName;
            const users = this.getAllUsers();

            if (!users[username]) {
                // Should exist, but just in case
                this.setLocalUser(username);
                return this.addBadge(badgeName, badgeEmoji);
            }

            if (!users[username].badges) {
                users[username].badges = [];
            }

            users[username].badges.push({
                name: badgeName,
                emoji: badgeEmoji,
                earnedAt: new Date().toISOString()
            });

            return this.saveAllUsers(users);
        }
    }

    async getBadges() {
        if (!this.currentUser) return [];

        if (this.isApiUser) {
            try {
                return await this.apiService.getBadges();
            } catch (e) {
                console.error('Failed to get badges via API', e);
                return [];
            }
        } else {
            // Local storage logic
            const username = this.currentUser.displayName;
            const users = this.getAllUsers();
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
    }

    async getBadgeCount() {
        const badges = await this.getBadges();
        return badges.length;
    }
}
