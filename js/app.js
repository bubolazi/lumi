// Application Entry Point - MVC Initialization with Subject Selection
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
        const auth0Service = new Auth0Service();

        // Handle Auth0 callback before initializing the app
        if (auth0Service.isCallbackRequest()) {
            try {
                const apiService = new ApiService();
                const result = await auth0Service.handleCallback(apiService);

                // Reload with the clean return path (history.replaceState already called)
                // Re-initialize now that user is authenticated
                this.startApp(auth0Service);
                return;
            } catch (e) {
                console.error('Auth0 callback failed:', e);
                // Clear any stale PKCE state and proceed unauthenticated
                sessionStorage.removeItem('pkce_code_verifier');
                sessionStorage.removeItem('oauth_state');
                sessionStorage.removeItem('oauth_return_path');
            }
        }

        this.startApp(auth0Service);
    }

    startApp(auth0Service) {
        const localization = new LocalizationModel('bg');
        const userStorage = new UserStorageModel();
        const subjectManager = new SubjectManager();
        const controller = new AppController(localization, subjectManager, userStorage, auth0Service);

        this.localization = localization;
        this.userStorage = userStorage;
        this.subjectManager = subjectManager;
        this.controller = controller;

        window.lumiApp = this;

        console.log('Learning App initialized with Auth0 SSO');
    }
}

new LumiApp();
