class ApiService {
    constructor(baseUrl = null) {
        // Use config if available, otherwise use parameter or default
        this.baseUrl = baseUrl || (window.LUMI_CONFIG ? window.LUMI_CONFIG.API_BASE_URL : 'http://localhost:3000');
    }

    async request(endpoint, method, body = null, requireAuth = false) {
        const headers = {
            'Content-Type': 'application/json'
        };

        // Note: No need to manually set Authorization header
        // Cookies are sent automatically with credentials: 'include'

        const config = {
            method,
            headers,
            credentials: 'include', // Important: Send cookies with requests
        };

        if (body) {
            config.body = JSON.stringify(body);
        }

        try {
            const response = await fetch(`${this.baseUrl}${endpoint}`, config);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || `API Error: ${response.statusText}`);
            }
            return data;
        } catch (error) {
            console.error('API Request failed:', error);
            throw error;
        }
    }

    async login(email, password, captchaToken) {
        try {
            const response = await this.request('/api/lumi/auth/login', 'POST', {
                email,
                password,
                captchaToken
            });

            // Tokens are now in HTTP-only cookies (set by server)
            // We only store non-sensitive user info in sessionStorage
            if (response.success && response.user) {
                sessionStorage.setItem('lumi_user', JSON.stringify(response.user));
                return response;
            }

            return response; // Return error response with userNotFound flag if present
        } catch (error) {
            console.error('Login error:', error);
            return {
                success: false,
                message: error.message || 'Login failed',
                userNotFound: error.userNotFound || false
            };
        }
    }

    async register(email, password, displayName, captchaToken) {
        const response = await this.request('/api/lumi/auth/register', 'POST', {
            email,
            password,
            displayName,
            captchaToken
        });

        // Tokens are now in HTTP-only cookies
        if (response.success && response.user) {
            sessionStorage.setItem('lumi_user', JSON.stringify(response.user));
        }

        return response;
    }

    async logout() {
        try {
            await this.request('/api/lumi/auth/logout', 'POST', {}, true);
        } catch (e) {
            console.warn('Logout failed on server, clearing local state anyway', e);
        }

        // Clear user info (cookies are cleared by server)
        sessionStorage.removeItem('lumi_user');
    }

    async getBadges() {
        return this.request('/api/lumi/badges', 'GET', null, true);
    }

    async createBadge(badge) {
        return this.request('/api/lumi/badges', 'POST', badge, true);
    }

    async exchangeSsoToken(ssoToken, targetApp) {
        return this.request('/api/auth/sso/exchange', 'POST', { ssoToken, targetApp });
    }

    async getLinkedApps() {
        return this.request('/api/auth/sso/apps', 'GET', null, true);
    }

    async getKidAccounts() {
        return this.request('/api/lumi/accounts/kids', 'GET', null, true);
    }

    async addKidAccount(displayName) {
        return this.request('/api/lumi/accounts/kids', 'POST', { displayName }, true);
    }

    async removeKidAccount(kidId) {
        return this.request(`/api/lumi/accounts/kids/${kidId}`, 'DELETE', null, true);
    }

    async switchToKidAccount(kidId) {
        return this.request(`/api/lumi/accounts/kids/${kidId}/switch`, 'POST', null, true);
    }

    // Helper method to check if user is authenticated
    isAuthenticated() {
        // We check if user info exists in sessionStorage
        // The actual auth is handled by HTTP-only cookies sent automatically
        return !!sessionStorage.getItem('lumi_user');
    }

    // Helper method to get current user info
    getCurrentUser() {
        const userJson = sessionStorage.getItem('lumi_user');
        return userJson ? JSON.parse(userJson) : null;
    }
}

