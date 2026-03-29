class UserStorageModel {
    constructor() {
        this.apiService = new ApiService();
        this.currentUser = null;

        this.USERS_KEY = 'lumi_users';
        this.CURRENT_USER_KEY = 'lumi_current_user';

        this.loadUserFromSession();
    }

    loadUserFromSession() {
        // Check for Auth0 user session
        const apiUserData = sessionStorage.getItem('lumi_user');
        if (apiUserData) {
            try {
                this.currentUser = JSON.parse(apiUserData);
                return;
            } catch (e) {
                console.error('Failed to parse user session data', e);
                sessionStorage.removeItem('lumi_user');
            }
        }

        // Fallback to legacy local user
        const localUser = sessionStorage.getItem(this.CURRENT_USER_KEY);
        if (localUser) {
            this.currentUser = { displayName: localUser };
        }
    }

    getCurrentUser() {
        if (!this.currentUser) return null;
        return this.currentUser.displayName || this.currentUser.email || 'User';
    }

    isAuthenticated() {
        return !!this.currentUser;
    }

    // Legacy local user support (offline fallback)
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

        sessionStorage.removeItem('lumi_user');
        sessionStorage.setItem(this.CURRENT_USER_KEY, trimmedUsername);

        this.currentUser = { displayName: trimmedUsername };

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

    // Called after Auth0 callback completes — user is already set in sessionStorage
    // by ApiService.exchangeCodeForSession(); just reload from session.
    loadAuth0User() {
        this.loadUserFromSession();
    }

    async logout() {
        const response = await this.apiService.logout();

        sessionStorage.removeItem(this.CURRENT_USER_KEY);
        this.currentUser = null;

        return response;
    }

    async addBadge(badgeName, badgeEmoji = '') {
        if (!this.currentUser) return false;

        if (this.currentUser.id) {
            // Auth0 user — save via API
            try {
                await this.apiService.createBadge({ badge_name: badgeName, badge_emoji: badgeEmoji });
                return true;
            } catch (e) {
                console.error('Failed to add badge via API', e);
                return false;
            }
        } else {
            // Legacy local user
            const username = this.currentUser.displayName;
            const users = this.getAllUsers();

            if (!users[username]) {
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

        if (this.currentUser.id) {
            // Auth0 user — fetch via API
            try {
                return await this.apiService.getBadges();
            } catch (e) {
                console.error('Failed to get badges via API', e);
                return [];
            }
        } else {
            // Legacy local user
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
