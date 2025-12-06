const { describe, test, expect, beforeEach } = require('@jest/globals');

// Mock ApiService
class MockApiService {
    constructor() {
        this.users = {};
        this.badges = {};
    }

    async login(email, password) {
        if (email === 'test@example.com' && password === 'password') {
            return { success: true, user: { displayName: 'TestUser', email } };
        }
        if (email === 'notfound@example.com') {
            return { success: false, userNotFound: true };
        }
        return { success: false, message: 'Invalid credentials' };
    }

    async register(email, password, displayName) {
        return { success: true, user: { displayName, email }, session: { accessToken: 'token' } };
    }

    logout() { }

    async createBadge(badge) {
        return { success: true };
    }

    async getBadges() {
        return [{ name: 'TestBadge', emoji: '🏆' }];
    }
}

global.ApiService = MockApiService;

// Mock sessionStorage
const sessionStorageMock = (() => {
    let store = {};
    return {
        getItem: (key) => store[key] || null,
        setItem: (key, value) => { store[key] = value.toString(); },
        removeItem: (key) => { delete store[key]; },
        clear: () => { store = {}; }
    };
})();
Object.defineProperty(global, 'sessionStorage', { value: sessionStorageMock });

// Mock localStorage
const localStorageMock = (() => {
    let store = {};
    return {
        getItem: (key) => store[key] || null,
        setItem: (key, value) => { store[key] = value.toString(); },
        removeItem: (key) => { delete store[key]; },
        clear: () => { store = {}; }
    };
})();
Object.defineProperty(global, 'localStorage', { value: localStorageMock });

describe('User Storage - UserStorageModel', () => {
    let userStorage;

    beforeEach(() => {
        sessionStorage.clear();
        localStorage.clear();
        // Re-instantiate to reset state
        // We need to make sure UserStorageModel uses the global ApiService mock
        // Since we can't easily import the class here if it's not exported, 
        // we assume the test runner loads the file or we paste the class definition for testing if needed.
        // For this environment, we'll assume the class is available or we'd need to require it.
        // But since the original test file didn't require it, it must be loaded by setup.js or similar.
        userStorage = new UserStorageModel();
    });

    describe('Local User Management', () => {
        test('should set local user', () => {
            const result = userStorage.setLocalUser('LocalUser');
            expect(result).toBe(true);
            expect(userStorage.getCurrentUser()).toBe('LocalUser');
            expect(userStorage.isApiUser).toBe(false);
        });

        test('should persist local user in localStorage', () => {
            userStorage.setLocalUser('LocalUser');
            const users = userStorage.getAllUsers();
            expect(users['LocalUser']).toBeDefined();
        });

        test('should add badge to local user', async () => {
            userStorage.setLocalUser('LocalUser');
            await userStorage.addBadge('LocalBadge', '⭐');
            const badges = await userStorage.getBadges();
            expect(badges.length).toBe(1);
            expect(badges[0].name).toBe('LocalBadge');
        });
    });

    describe('API User Management', () => {
        test('should login API user', async () => {
            const result = await userStorage.login('test@example.com', 'password', 'token');
            expect(result.success).toBe(true);
            expect(userStorage.getCurrentUser()).toBe('TestUser');
            expect(userStorage.isApiUser).toBe(true);
        });

        test('should fail login with wrong credentials', async () => {
            const result = await userStorage.login('wrong@example.com', 'password', 'token');
            expect(result.success).toBe(false);
            expect(userStorage.getCurrentUser()).toBeNull();
        });

        test('should register API user', async () => {
            const result = await userStorage.register('new@example.com', 'password', 'NewUser', 'token');
            expect(result.success).toBe(true);
            expect(userStorage.getCurrentUser()).toBe('NewUser');
            expect(userStorage.isApiUser).toBe(true);
        });

        test('should add badge to API user', async () => {
            await userStorage.login('test@example.com', 'password', 'token');
            const result = await userStorage.addBadge('ApiBadge', '🏆');
            expect(result).toBe(true);
        });
    });

    describe('Hybrid Logic', () => {
        test('should switch from local to API user', async () => {
            userStorage.setLocalUser('LocalUser');
            expect(userStorage.isApiUser).toBe(false);

            await userStorage.login('test@example.com', 'password', 'token');
            expect(userStorage.getCurrentUser()).toBe('TestUser');
            expect(userStorage.isApiUser).toBe(true);
            expect(sessionStorage.getItem('lumi_current_user')).toBeNull();
        });

        test('should switch from API to local user', async () => {
            await userStorage.login('test@example.com', 'password', 'token');
            expect(userStorage.isApiUser).toBe(true);

            userStorage.setLocalUser('LocalUser');
            expect(userStorage.getCurrentUser()).toBe('LocalUser');
            expect(userStorage.isApiUser).toBe(false);
            expect(sessionStorage.getItem('lumi_user')).toBeNull();
        });
    });
});
