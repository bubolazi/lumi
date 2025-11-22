const { describe, test, expect, beforeEach } = require('@jest/globals');

describe('User Storage - UserStorageModel', () => {
    let userStorage;
    
    beforeEach(() => {
        localStorage.clear();
        sessionStorage.clear();
        userStorage = new UserStorageModel();
    });
    
    describe('User Management', () => {
        test('should return null when no user is logged in', () => {
            expect(userStorage.getCurrentUser()).toBeNull();
        });
        
        test('should set and get current user', async () => {
            const result = await userStorage.setCurrentUser('Петър');
            expect(result.success).toBe(true);
            expect(userStorage.getCurrentUser()).toBe('Петър');
        });
        
        test('should trim username whitespace', async () => {
            await userStorage.setCurrentUser('  Мария  ');
            expect(userStorage.getCurrentUser()).toBe('Мария');
        });
        
        test('should reject empty username', async () => {
            const result = await userStorage.setCurrentUser('');
            expect(result.success).toBe(false);
            expect(userStorage.getCurrentUser()).toBeNull();
        });
        
        test('should reject whitespace-only username', async () => {
            const result = await userStorage.setCurrentUser('   ');
            expect(result.success).toBe(false);
            expect(userStorage.getCurrentUser()).toBeNull();
        });
        
        test('should logout current user', async () => {
            await userStorage.setCurrentUser('Иван');
            expect(userStorage.getCurrentUser()).toBe('Иван');
            
            userStorage.logout();
            expect(userStorage.getCurrentUser()).toBeNull();
        });
        
        test('should create user automatically when setting current user', async () => {
            await userStorage.setCurrentUser('Георги');
            expect(userStorage.userExists('Георги')).toBe(true);
        });
    });
    
    describe('User Data Persistence', () => {
        test('should persist user data in localStorage', async () => {
            await userStorage.setCurrentUser('София');
            
            const newStorage = new UserStorageModel();
            expect(newStorage.userExists('София')).toBe(true);
        });
        
        test('should maintain current user in session storage only', async () => {
            await userStorage.setCurrentUser('Николай');
            
            sessionStorage.clear();
            
            expect(userStorage.getCurrentUser()).toBeNull();
            expect(userStorage.userExists('Николай')).toBe(true);
        });
        
        test('should get all users', async () => {
            await userStorage.setCurrentUser('Александър');
            userStorage.logout();
            await userStorage.setCurrentUser('Елена');
            
            const users = userStorage.getAllUsers();
            expect(Object.keys(users)).toContain('Александър');
            expect(Object.keys(users)).toContain('Елена');
        });
        
        test('should return empty object when no users exist', () => {
            const users = userStorage.getAllUsers();
            expect(users).toEqual({});
        });
    });
    
    describe('Badge Management', () => {
        beforeEach(async () => {
            await userStorage.setCurrentUser('Димитър');
        });
        
        test('should add badge to current user', async () => {
            const badgeName = 'Смело Мече';
            const badgeEmoji = '🐻';
            const result = await userStorage.addBadge('Димитър', badgeName, badgeEmoji);
            
            expect(result).toBe(true);
            const badges = await userStorage.getBadges('Димитър');
            expect(badges.length).toBe(1);
            expect(badges[0].name).toBe(badgeName);
            expect(badges[0].emoji).toBe(badgeEmoji);
        });
        
        test('should add multiple badges', async () => {
            await userStorage.addBadge('Димитър', 'Значка 1');
            await userStorage.addBadge('Димитър', 'Значка 2');
            await userStorage.addBadge('Димитър', 'Значка 3');
            
            const badges = await userStorage.getBadges('Димитър');
            expect(badges.length).toBe(3);
        });
        
        test('should store badges as objects with name and emoji', async () => {
            await userStorage.addBadge('Димитър', 'Звездна Панда', '🐼');
            
            const badges = await userStorage.getBadges('Димитър');
            expect(typeof badges[0]).toBe('object');
            expect(badges[0].name).toBe('Звездна Панда');
            expect(badges[0].emoji).toBe('🐼');
        });
        
        test('should get badge count', async () => {
            await userStorage.addBadge('Димитър', 'Значка 1');
            await userStorage.addBadge('Димитър', 'Значка 2');
            
            expect(await userStorage.getBadgeCount('Димитър')).toBe(2);
        });
        
        test('should return 0 badge count for new user', async () => {
            expect(await userStorage.getBadgeCount('НовПотребител')).toBe(0);
        });
        
        test('should return empty array for user with no badges', async () => {
            const badges = await userStorage.getBadges('Димитър');
            expect(badges).toEqual([]);
        });
        
        test('should separate badges by user', async () => {
            await userStorage.addBadge('Димитър', 'Значка Димитър', '🏆');
            
            userStorage.logout();
            await userStorage.setCurrentUser('Анна');
            await userStorage.addBadge('Анна', 'Значка Анна', '⭐');
            
            const dimitarBadges = await userStorage.getBadges('Димитър');
            const annaBadges = await userStorage.getBadges('Анна');
            
            expect(dimitarBadges.length).toBe(1);
            expect(annaBadges.length).toBe(1);
            expect(dimitarBadges[0].name).toBe('Значка Димитър');
            expect(dimitarBadges[0].emoji).toBe('🏆');
            expect(annaBadges[0].name).toBe('Значка Анна');
            expect(annaBadges[0].emoji).toBe('⭐');
        });
        
        test('should create user if adding badge to non-existent user', async () => {
            await userStorage.addBadge('НовПотребител', 'Първа значка');
            
            expect(userStorage.userExists('НовПотребител')).toBe(true);
            expect(await userStorage.getBadgeCount('НовПотребител')).toBe(1);
        });
    });
    
    describe('User Data Structure', () => {
        test('should include createdAt timestamp when creating user', async () => {
            await userStorage.setCurrentUser('Стоян');
            
            const userData = userStorage.getUserData('Стоян');
            expect(userData.createdAt).toBeDefined();
            expect(typeof userData.createdAt).toBe('string');
        });
        
        test('should return null for non-existent user', () => {
            const userData = userStorage.getUserData('НесъществуващПотребител');
            expect(userData).toBeNull();
        });
    });
});
