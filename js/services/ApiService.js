class ApiService {
    constructor(baseUrl = null) {
        this.baseUrl = baseUrl || (window.LUMI_CONFIG ? window.LUMI_CONFIG.API_BASE_URL : 'http://localhost:3000');
    }

    async request(endpoint, method, body = null) {
        const headers = {
            'Content-Type': 'application/json'
        };

        const config = {
            method,
            headers,
            credentials: 'include', // Send HTTP-only cookies automatically
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

    async exchangeCodeForSession(code, codeVerifier, redirectUri) {
        const response = await this.request('/api/auth/callback', 'POST', {
            code,
            codeVerifier,
            state: sessionStorage.getItem('oauth_state') || '',
            redirectUri,
        });

        if (response.user) {
            sessionStorage.setItem('lumi_user', JSON.stringify(response.user));
        }

        return response;
    }

    async refreshSession() {
        return this.request('/api/auth/refresh', 'POST');
    }

    async logout() {
        try {
            const response = await this.request('/api/auth/logout', 'POST');
            sessionStorage.removeItem('lumi_user');
            return response;
        } catch (e) {
            console.warn('Logout request failed, clearing local state anyway', e);
            sessionStorage.removeItem('lumi_user');
            return null;
        }
    }

    async getBadges() {
        return this.request('/api/lumi/badges', 'GET');
    }

    async createBadge(badge) {
        return this.request('/api/lumi/badges', 'POST', badge);
    }

    async detectLocale() {
        try {
            const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
            return await this.request(`/api/locale/detect?tz=${encodeURIComponent(tz)}`, 'GET');
        } catch (e) {
            return { locale: 'en' };
        }
    }

    async getUserLocale() {
        try {
            return await this.request('/api/lumi/locale', 'GET');
        } catch (e) {
            return { locale: null };
        }
    }

    async setUserLocale(locale) {
        return this.request('/api/lumi/locale', 'PUT', { locale });
    }

    isAuthenticated() {
        return !!sessionStorage.getItem('lumi_user');
    }

    getCurrentUser() {
        const userJson = sessionStorage.getItem('lumi_user');
        return userJson ? JSON.parse(userJson) : null;
    }
}
