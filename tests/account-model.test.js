const { describe, test, expect, beforeEach } = require('@jest/globals');

class MockApiService {
    async exchangeSsoToken(ssoToken) {
        if (ssoToken === 'valid-sso-token') {
            return { success: true, user: { displayName: 'SsoUser', email: 'sso@example.com', accountType: 'standard' } };
        }
        return { success: false, message: 'Invalid SSO token' };
    }

    async getLinkedApps() {
        return [{ app: 'lumi' }, { app: 'store' }];
    }

    async getKidAccounts() {
        return [{ id: 'kid1', displayName: 'Kid One' }, { id: 'kid2', displayName: 'Kid Two' }];
    }

    async addKidAccount(displayName) {
        return { success: true, kid: { id: 'kid3', displayName } };
    }

    async removeKidAccount(kidId) {
        return { success: true };
    }

    async switchToKidAccount(kidId) {
        if (kidId === 'kid1') {
            return { success: true, kidAccount: { id: 'kid1', displayName: 'Kid One' } };
        }
        return { success: false };
    }
}

global.AccountModel = AccountModel;

describe('AccountModel - SSO Integration', () => {
    let accountModel;
    let mockApi;

    beforeEach(() => {
        mockApi = new MockApiService();
        accountModel = new AccountModel(mockApi);
    });

    test('should exchange a valid SSO token', async () => {
        const response = await accountModel.exchangeSsoToken('valid-sso-token', AccountModel.SSO_APPS.LUMI);
        expect(response.success).toBe(true);
        expect(response.user.displayName).toBe('SsoUser');
    });

    test('should return failure for invalid SSO token', async () => {
        const response = await accountModel.exchangeSsoToken('bad-token', AccountModel.SSO_APPS.LUMI);
        expect(response.success).toBe(false);
    });

    test('should return linked apps', async () => {
        const apps = await accountModel.getLinkedApps();
        expect(apps.length).toBe(2);
        expect(apps[0].app).toBe('lumi');
    });
});

describe('AccountModel - Kid Account Management', () => {
    let accountModel;
    let mockApi;

    beforeEach(() => {
        mockApi = new MockApiService();
        accountModel = new AccountModel(mockApi);
    });

    test('should get kid accounts', async () => {
        const kids = await accountModel.getKidAccounts();
        expect(kids.length).toBe(2);
        expect(kids[0].displayName).toBe('Kid One');
    });

    test('should add a kid account', async () => {
        const response = await accountModel.addKidAccount('New Kid');
        expect(response.success).toBe(true);
        expect(response.kid.displayName).toBe('New Kid');
    });

    test('should remove a kid account', async () => {
        const response = await accountModel.removeKidAccount('kid1');
        expect(response.success).toBe(true);
    });

    test('should switch to a kid account', async () => {
        const response = await accountModel.switchToKidAccount('kid1');
        expect(response.success).toBe(true);
        expect(accountModel.getActiveKidAccount().displayName).toBe('Kid One');
    });

    test('should clear active kid account when switching back to parent', async () => {
        await accountModel.switchToKidAccount('kid1');
        accountModel.switchBackToParent();
        expect(accountModel.getActiveKidAccount()).toBeNull();
    });

    test('should return active kid as display user when kid is active', async () => {
        const parent = { displayName: 'Parent', accountType: 'parent' };
        await accountModel.switchToKidAccount('kid1');
        const displayUser = accountModel.getDisplayUser(parent);
        expect(displayUser.displayName).toBe('Kid One');
    });

    test('should return parent as display user when no kid is active', () => {
        const parent = { displayName: 'Parent', accountType: 'parent' };
        const displayUser = accountModel.getDisplayUser(parent);
        expect(displayUser).toBe(parent);
    });
});

describe('AccountModel - Account Type Detection', () => {
    let accountModel;
    let mockApi;

    beforeEach(() => {
        mockApi = new MockApiService();
        accountModel = new AccountModel(mockApi);
    });

    test('should identify a parent account', () => {
        const user = { displayName: 'Parent', accountType: 'parent' };
        expect(accountModel.isParentAccount(user)).toBe(true);
        expect(accountModel.isKidAccount(user)).toBe(false);
    });

    test('should identify a kid account', () => {
        const user = { displayName: 'Kid', accountType: 'kid' };
        expect(accountModel.isKidAccount(user)).toBe(true);
        expect(accountModel.isParentAccount(user)).toBe(false);
    });

    test('should return false for null user', () => {
        expect(accountModel.isParentAccount(null)).toBe(false);
        expect(accountModel.isKidAccount(null)).toBe(false);
    });
});

describe('UserStorageModel - Account Architecture Integration', () => {
    let userStorage;

    const mockApiService = {
        login: async (email, password) => {
            if (email === 'parent@example.com') {
                return { success: true, user: { displayName: 'ParentUser', email, accountType: 'parent' } };
            }
            return { success: false, message: 'Invalid credentials' };
        },
        register: async (email, password, displayName) => {
            return { success: true, user: { displayName, email, accountType: 'standard' }, session: true };
        },
        logout: () => {},
        createBadge: async () => ({ success: true }),
        getBadges: async () => [],
        exchangeSsoToken: async (ssoToken) => {
            if (ssoToken === 'valid-sso') {
                return { success: true, user: { displayName: 'SsoUser', email: 'sso@test.com', accountType: 'standard' } };
            }
            return { success: false, message: 'Invalid SSO token' };
        },
        getLinkedApps: async () => [{ app: 'lumi' }, { app: 'store' }],
        getKidAccounts: async () => [{ id: 'k1', displayName: 'Little One' }],
        addKidAccount: async (displayName) => ({ success: true, kid: { id: 'k2', displayName } }),
        removeKidAccount: async () => ({ success: true }),
        switchToKidAccount: async (kidId) => ({ success: true, kidAccount: { id: kidId, displayName: 'Little One' } })
    };

    const sessionStorageMock = (() => {
        let store = {};
        return {
            getItem: (key) => store[key] || null,
            setItem: (key, value) => { store[key] = value.toString(); },
            removeItem: (key) => { delete store[key]; },
            clear: () => { store = {}; }
        };
    })();

    const localStorageMock = (() => {
        let store = {};
        return {
            getItem: (key) => store[key] || null,
            setItem: (key, value) => { store[key] = value.toString(); },
            removeItem: (key) => { delete store[key]; },
            clear: () => { store = {}; }
        };
    })();

    beforeEach(() => {
        sessionStorageMock.clear();
        localStorageMock.clear();
        Object.defineProperty(global, 'sessionStorage', { value: sessionStorageMock, configurable: true });
        Object.defineProperty(global, 'localStorage', { value: localStorageMock, configurable: true });

        global.ApiService = function() { return mockApiService; };
        global.AccountModel = AccountModel;
        userStorage = new UserStorageModel();
    });

    test('should login with SSO token and store user', async () => {
        const result = await userStorage.loginWithSso('valid-sso', AccountModel.SSO_APPS.LUMI);
        expect(result.success).toBe(true);
        expect(userStorage.isApiUser).toBe(true);
    });

    test('should fail SSO login with bad token', async () => {
        const result = await userStorage.loginWithSso('bad-token', AccountModel.SSO_APPS.LUMI);
        expect(result.success).toBe(false);
    });

    test('should get kid accounts when logged in as API user', async () => {
        await userStorage.login('parent@example.com', 'password', 'token');
        const kids = await userStorage.getKidAccounts();
        expect(kids.length).toBe(1);
        expect(kids[0].displayName).toBe('Little One');
    });

    test('should return empty array for kid accounts when not API user', async () => {
        userStorage.setLocalUser('LocalUser');
        const kids = await userStorage.getKidAccounts();
        expect(kids).toEqual([]);
    });

    test('should add a kid account when logged in', async () => {
        await userStorage.login('parent@example.com', 'password', 'token');
        const result = await userStorage.addKidAccount('New Kid');
        expect(result.success).toBe(true);
        expect(result.kid.displayName).toBe('New Kid');
    });

    test('should switch to kid account and reflect in display user', async () => {
        await userStorage.login('parent@example.com', 'password', 'token');
        await userStorage.switchToKidAccount('k1');
        const display = userStorage.getCurrentDisplayUser();
        expect(display.displayName).toBe('Little One');
    });

    test('should switch back to parent account', async () => {
        await userStorage.login('parent@example.com', 'password', 'token');
        await userStorage.switchToKidAccount('k1');
        userStorage.switchBackToParent();
        const display = userStorage.getCurrentDisplayUser();
        expect(display.displayName).toBe('ParentUser');
    });

    test('should identify parent account type', async () => {
        await userStorage.login('parent@example.com', 'password', 'token');
        expect(userStorage.isParentAccount()).toBe(true);
    });
});
