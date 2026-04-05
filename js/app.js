class LumiApp {
    constructor() {
        this.init();
    }

    init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.initializeMVC());
        } else {
            this.initializeMVC();
        }
    }

    async initializeMVC() {
        const apiService = new ApiService();
        const auth0Service = new Auth0Service();

        if (auth0Service.isCallbackRequest()) {
            try {
                await auth0Service.handleCallback(apiService);
            } catch (e) {
                console.error('Auth0 callback failed:', e);
                sessionStorage.removeItem('pkce_code_verifier');
                sessionStorage.removeItem('oauth_state');
                sessionStorage.removeItem('oauth_return_path');
            }
        }

        const locale = await this.resolveLocale(apiService);
        this.startApp(auth0Service, apiService, locale);
    }

    async resolveLocale(apiService) {
        const stored = localStorage.getItem('lumi_locale');
        if (stored) return stored;

        if (apiService.isAuthenticated()) {
            const result = await apiService.getUserLocale();
            if (result && result.locale) return result.locale;
        }

        const result = await apiService.detectLocale();
        return result.locale || 'en';
    }

    startApp(auth0Service, apiService, locale) {
        const localization = new LocalizationModel(locale);
        const userStorage = new UserStorageModel(apiService);
        const subjectManager = new SubjectManager();
        const controller = new AppController(localization, subjectManager, userStorage, auth0Service, apiService);

        this.localization = localization;
        this.userStorage = userStorage;
        this.subjectManager = subjectManager;
        this.controller = controller;

        window.lumiApp = this;

        console.log('Learning App initialized');
    }
}

new LumiApp();
