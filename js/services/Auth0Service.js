class Auth0Service {
    generateCodeVerifier() {
        const array = new Uint8Array(32);
        crypto.getRandomValues(array);
        return btoa(String.fromCharCode(...array))
            .replace(/\+/g, '-')
            .replace(/\//g, '_')
            .replace(/=/g, '');
    }

    async generateCodeChallenge(codeVerifier) {
        const encoder = new TextEncoder();
        const data = encoder.encode(codeVerifier);
        const digest = await crypto.subtle.digest('SHA-256', data);
        return btoa(String.fromCharCode(...new Uint8Array(digest)))
            .replace(/\+/g, '-')
            .replace(/\//g, '_')
            .replace(/=/g, '');
    }

    async initiateLogin(returnPath, locale = 'en') {
        const config = window.LUMI_CONFIG;
        const codeVerifier = this.generateCodeVerifier();
        const codeChallenge = await this.generateCodeChallenge(codeVerifier);

        const stateResponse = await fetch(`${config.API_BASE_URL}/api/auth/state`);
        const { state } = await stateResponse.json();

        sessionStorage.setItem('pkce_code_verifier', codeVerifier);
        sessionStorage.setItem('oauth_state', state);
        sessionStorage.setItem('oauth_return_path', returnPath || '/');

        const params = new URLSearchParams({
            response_type: 'code',
            client_id: config.AUTH0_CLIENT_ID,
            redirect_uri: config.AUTH0_CALLBACK_URL,
            scope: 'openid profile email offline_access',
            audience: config.AUTH0_AUDIENCE,
            state,
            code_challenge: codeChallenge,
            code_challenge_method: 'S256',
            ui_locales: locale,
        });

        window.location.href = `https://${config.AUTH0_DOMAIN}/authorize?${params}`;
    }

    isCallbackRequest() {
        const params = new URLSearchParams(window.location.search);
        return params.has('code') && params.has('state');
    }

    async handleCallback(apiService) {
        const params = new URLSearchParams(window.location.search);
        const code = params.get('code');
        const returnedState = params.get('state');
        const storedState = sessionStorage.getItem('oauth_state');
        const codeVerifier = sessionStorage.getItem('pkce_code_verifier');

        if (!code || returnedState !== storedState) {
            sessionStorage.removeItem('oauth_state');
            sessionStorage.removeItem('pkce_code_verifier');
            sessionStorage.removeItem('oauth_return_path');
            throw new Error('Invalid OAuth callback: state mismatch');
        }

        sessionStorage.removeItem('oauth_state');
        sessionStorage.removeItem('pkce_code_verifier');

        const result = await apiService.exchangeCodeForSession(
            code,
            codeVerifier,
            returnedState,
            window.LUMI_CONFIG.AUTH0_CALLBACK_URL,
        );

        const returnPath = sessionStorage.getItem('oauth_return_path') || '/';
        sessionStorage.removeItem('oauth_return_path');

        window.history.replaceState({}, document.title, returnPath);

        return result;
    }
}
