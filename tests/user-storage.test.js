const { describe, test, expect, beforeEach } = require('@jest/globals');

// Mock ApiService matching the Auth0-based implementation
class MockApiService {
    async logout() {
        return { logoutUrl: 'https://auth0.example.com/v2/logout?client_id=abc' };
    }

    async createBadge(badge) {
        return { id: '1', badge_name: badge.badge_name, badge_emoji: badge.badge_emoji };
    }

    async getBadges() {
        return [{ name: 'TestBadge', emoji: '🏆', earnedAt: '2024-01-01' }];
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
        userStorage = new UserStorageModel();
    });

    describe('Local User Management', () => {
        test('should set local user', () => {
            const result = userStorage.setLocalUser('LocalUser');
            expect(result).toBe(true);
            expect(userStorage.getCurrentUser()).toBe('LocalUser');
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

        test('should return empty badges for local user with no badges', async () => {
            userStorage.setLocalUser('NewUser');
            const badges = await userStorage.getBadges();
            expect(badges).toEqual([]);
        });
    });

    describe('Auth0 User Management', () => {
        test('should load Auth0 user from sessionStorage', () => {
            sessionStorage.setItem('lumi_user', JSON.stringify({
                id: 'auth0|abc123',
                email: 'test@example.com',
                displayName: 'TestUser'
            }));

            userStorage.loadAuth0User();
            expect(userStorage.getCurrentUser()).toBe('TestUser');
            expect(userStorage.isAuthenticated()).toBe(true);
        });

        test('should identify Auth0 user by id property', () => {
            sessionStorage.setItem('lumi_user', JSON.stringify({
                id: 'auth0|abc123',
                email: 'test@example.com',
                displayName: 'TestUser'
            }));
            userStorage.loadAuth0User();

            expect(userStorage.currentUser.id).toBe('auth0|abc123');
        });

        test('should get badges from API for Auth0 user', async () => {
            sessionStorage.setItem('lumi_user', JSON.stringify({
                id: 'auth0|abc123',
                email: 'test@example.com',
                displayName: 'TestUser'
            }));
            userStorage.loadAuth0User();

            const badges = await userStorage.getBadges();
            expect(badges.length).toBe(1);
            expect(badges[0].name).toBe('TestBadge');
        });

        test('should add badge via API for Auth0 user', async () => {
            sessionStorage.setItem('lumi_user', JSON.stringify({
                id: 'auth0|abc123',
                email: 'test@example.com',
                displayName: 'TestUser'
            }));
            userStorage.loadAuth0User();

            const result = await userStorage.addBadge('ApiBadge', '🏆');
            expect(result).toBe(true);
        });
    });

    describe('Logout', () => {
        test('should clear session on logout', async () => {
            sessionStorage.setItem('lumi_user', JSON.stringify({
                id: 'auth0|abc123',
                email: 'test@example.com',
                displayName: 'TestUser'
            }));
            userStorage.loadAuth0User();
            expect(userStorage.isAuthenticated()).toBe(true);

            await userStorage.logout();
            expect(userStorage.getCurrentUser()).toBeNull();
            expect(userStorage.isAuthenticated()).toBe(false);
        });

        test('should return logoutUrl from API on logout', async () => {
            sessionStorage.setItem('lumi_user', JSON.stringify({
                id: 'auth0|abc123',
                email: 'test@example.com',
                displayName: 'TestUser'
            }));
            userStorage.loadAuth0User();

            const response = await userStorage.logout();
            expect(response).toBeDefined();
            expect(response.logoutUrl).toContain('auth0.example.com');
        });
    });

    describe('isAuthenticated', () => {
        test('should return false when no user', () => {
            expect(userStorage.isAuthenticated()).toBe(false);
        });

        test('should return true for local user', () => {
            userStorage.setLocalUser('LocalUser');
            expect(userStorage.isAuthenticated()).toBe(true);
        });

        test('should return true for Auth0 user', () => {
            sessionStorage.setItem('lumi_user', JSON.stringify({
                id: 'auth0|abc123',
                displayName: 'TestUser'
            }));
            userStorage.loadAuth0User();
            expect(userStorage.isAuthenticated()).toBe(true);
        });
    });
});
