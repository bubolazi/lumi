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
        
        test('should set and get current user', () => {
            const result = userStorage.setCurrentUser('Петър');
            expect(result).toBe(true);
            expect(userStorage.getCurrentUser()).toBe('Петър');
        });
        
        test('should trim username whitespace', () => {
            userStorage.setCurrentUser('  Мария  ');
            expect(userStorage.getCurrentUser()).toBe('Мария');
        });
        
        test('should reject empty username', () => {
            const result = userStorage.setCurrentUser('');
            expect(result).toBe(false);
            expect(userStorage.getCurrentUser()).toBeNull();
        });
        
        test('should reject whitespace-only username', () => {
            const result = userStorage.setCurrentUser('   ');
            expect(result).toBe(false);
            expect(userStorage.getCurrentUser()).toBeNull();
        });
        
        test('should logout current user', () => {
            userStorage.setCurrentUser('Иван');
            expect(userStorage.getCurrentUser()).toBe('Иван');
            
            userStorage.logout();
            expect(userStorage.getCurrentUser()).toBeNull();
        });
        
        test('should create user automatically when setting current user', () => {
            userStorage.setCurrentUser('Георги');
            expect(userStorage.userExists('Георги')).toBe(true);
        });
    });
    
    describe('User Data Persistence', () => {
        test('should persist user data in localStorage', () => {
            userStorage.setCurrentUser('София');
            
            const newStorage = new UserStorageModel();
            expect(newStorage.userExists('София')).toBe(true);
        });
        
        test('should maintain current user in session storage only', () => {
            userStorage.setCurrentUser('Николай');
            
            sessionStorage.clear();
            
            expect(userStorage.getCurrentUser()).toBeNull();
            expect(userStorage.userExists('Николай')).toBe(true);
        });
        
        test('should get all users', () => {
            userStorage.setCurrentUser('Александър');
            userStorage.logout();
            userStorage.setCurrentUser('Елена');
            
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
        beforeEach(() => {
            userStorage.setCurrentUser('Димитър');
        });
        
        test('should add badge to current user', () => {
            const badgeName = 'Смело Мече';
            const result = userStorage.addBadge('Димитър', badgeName);
            
            expect(result).toBe(true);
            const badges = userStorage.getBadges('Димитър');
            expect(badges.length).toBe(1);
            expect(badges[0]).toBe(badgeName);
        });
        
        test('should add multiple badges', () => {
            userStorage.addBadge('Димитър', 'Значка 1');
            userStorage.addBadge('Димитър', 'Значка 2');
            userStorage.addBadge('Димитър', 'Значка 3');
            
            const badges = userStorage.getBadges('Димитър');
            expect(badges.length).toBe(3);
        });
        
        test('should store badges as simple strings', () => {
            userStorage.addBadge('Димитър', 'Звездна Панда');
            
            const badges = userStorage.getBadges('Димитър');
            expect(typeof badges[0]).toBe('string');
            expect(badges[0]).toBe('Звездна Панда');
        });
        
        test('should get badge count', () => {
            userStorage.addBadge('Димитър', 'Значка 1');
            userStorage.addBadge('Димитър', 'Значка 2');
            
            expect(userStorage.getBadgeCount('Димитър')).toBe(2);
        });
        
        test('should return 0 badge count for new user', () => {
            expect(userStorage.getBadgeCount('НовПотребител')).toBe(0);
        });
        
        test('should return empty array for user with no badges', () => {
            const badges = userStorage.getBadges('Димитър');
            expect(badges).toEqual([]);
        });
        
        test('should separate badges by user', () => {
            userStorage.addBadge('Димитър', 'Значка Димитър');
            
            userStorage.logout();
            userStorage.setCurrentUser('Анна');
            userStorage.addBadge('Анна', 'Значка Анна');
            
            const dimitarBadges = userStorage.getBadges('Димитър');
            const annaBadges = userStorage.getBadges('Анна');
            
            expect(dimitarBadges.length).toBe(1);
            expect(annaBadges.length).toBe(1);
            expect(dimitarBadges[0]).toBe('Значка Димитър');
            expect(annaBadges[0]).toBe('Значка Анна');
        });
        
        test('should create user if adding badge to non-existent user', () => {
            userStorage.addBadge('НовПотребител', 'Първа значка');
            
            expect(userStorage.userExists('НовПотребител')).toBe(true);
            expect(userStorage.getBadgeCount('НовПотребител')).toBe(1);
        });
    });
    
    describe('User Data Structure', () => {
        test('should include createdAt timestamp when creating user', () => {
            userStorage.setCurrentUser('Стоян');
            
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
