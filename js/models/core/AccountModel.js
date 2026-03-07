class AccountModel {
    static ACCOUNT_TYPES = {
        PARENT: 'parent',
        KID: 'kid',
        STANDARD: 'standard'
    };

    static SSO_APPS = {
        LUMI: 'lumi',
        STORE: 'store'
    };

    constructor(apiService) {
        this.apiService = apiService;
        this.activeKidAccount = null;
    }

    isParentAccount(user) {
        return !!(user && user.accountType === AccountModel.ACCOUNT_TYPES.PARENT);
    }

    isKidAccount(user) {
        return !!(user && user.accountType === AccountModel.ACCOUNT_TYPES.KID);
    }

    async exchangeSsoToken(ssoToken, targetApp) {
        return this.apiService.exchangeSsoToken(ssoToken, targetApp);
    }

    async getLinkedApps() {
        return this.apiService.getLinkedApps();
    }

    async getKidAccounts() {
        return this.apiService.getKidAccounts();
    }

    async addKidAccount(displayName) {
        return this.apiService.addKidAccount(displayName);
    }

    async removeKidAccount(kidId) {
        return this.apiService.removeKidAccount(kidId);
    }

    async switchToKidAccount(kidId) {
        const response = await this.apiService.switchToKidAccount(kidId);
        if (response && response.success) {
            this.activeKidAccount = response.kidAccount;
        }
        return response;
    }

    switchBackToParent() {
        this.activeKidAccount = null;
    }

    getActiveKidAccount() {
        return this.activeKidAccount;
    }

    getDisplayUser(parentUser) {
        return this.activeKidAccount || parentUser;
    }
}
