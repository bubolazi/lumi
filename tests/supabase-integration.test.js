const { describe, test, expect, beforeEach } = require('@jest/globals');

class SupabaseMockClient {
    constructor() {
        this.data = {
            users: [],
            badges: []
        };
        this.callLog = [];
        this.insertCounter = 0;
    }
    
    from(table) {
        const self = this;
        return {
            select: (columns) => self.createQuery(table, 'select', columns),
            insert: (rows) => self.createQuery(table, 'insert', rows),
            update: (values) => self.createQuery(table, 'update', values),
            delete: () => self.createQuery(table, 'delete')
        };
    }
    
    rpc(functionName, params) {
        this.callLog.push({ type: 'rpc', functionName, params });
        
        if (functionName === 'get_or_create_user') {
            return this.getOrCreateUser(params.p_username);
        }
        return Promise.resolve({ data: null, error: null });
    }
    
    createQuery(table, operation, data) {
        const self = this;
        const query = {
            table,
            operation,
            data,
            filters: {},
            orderBy: null,
            singleResult: false,
            
            eq: function(column, value) {
                this.filters[column] = value;
                return this;
            },
            
            single: function() {
                this.singleResult = true;
                return this;
            },
            
            order: function(column, options) {
                this.orderBy = { column, ...options };
                return this;
            },
            
            then: function(resolve) {
                self.callLog.push({ 
                    type: 'query', 
                    table: this.table, 
                    operation: this.operation,
                    filters: this.filters
                });
                
                return this.execute().then(resolve);
            },
            
            execute: async function() {
                switch (this.operation) {
                    case 'select':
                        return this.executeSelect();
                    case 'insert':
                        return this.executeInsert();
                    default:
                        return { data: null, error: null };
                }
            },
            
            executeSelect: async function() {
                let results = self.data[this.table] || [];
                
                if (this.filters.username) {
                    results = results.filter(r => r.username === this.filters.username);
                }
                if (this.filters.user_id) {
                    results = results.filter(r => r.user_id === this.filters.user_id);
                }
                
                if (this.orderBy) {
                    const { column, ascending } = this.orderBy;
                    results.sort((a, b) => {
                        if (ascending) {
                            return a[column] > b[column] ? 1 : -1;
                        } else {
                            return a[column] < b[column] ? 1 : -1;
                        }
                    });
                }
                
                if (this.singleResult) {
                    if (results.length === 0) {
                        return { 
                            data: null, 
                            error: { code: 'PGRST116', message: 'No rows found' } 
                        };
                    }
                    return { data: results[0], error: null };
                }
                
                return { data: results, error: null };
            },
            
            executeInsert: async function() {
                if (this.table === 'badges' && Array.isArray(this.data)) {
                    this.data.forEach((badge, index) => {
                        self.data.badges.push({
                            id: 'badge-' + Date.now() + '-' + self.insertCounter++,
                            ...badge,
                            earned_at: badge.earned_at || new Date(Date.now() + index).toISOString()
                        });
                    });
                }
                return { data: this.data, error: null };
            }
        };
        
        return query;
    }
    
    async getOrCreateUser(username) {
        let user = this.data.users.find(u => u.username === username);
        
        if (!user) {
            user = {
                id: 'user-' + Date.now() + '-' + Math.random(),
                username,
                created_at: new Date().toISOString()
            };
            this.data.users.push(user);
        }
        
        return { data: user.id, error: null };
    }
    
    reset() {
        this.data = {
            users: [],
            badges: []
        };
        this.callLog = [];
        this.insertCounter = 0;
    }
}

describe('Supabase Integration', () => {
    let supabaseStorage;
    let mockClient;
    let config;
    
    beforeEach(() => {
        mockClient = new SupabaseMockClient();
        config = {
            isEnabled: () => true,
            fallbackToLocalStorage: true,
            cacheTimeout: 5 * 60 * 1000,
            supabaseUrl: 'https://test.supabase.co',
            supabaseAnonKey: 'test-anon-key'
        };
        
        supabaseStorage = new SupabaseStorageModel(config);
        supabaseStorage.client = mockClient;
        
        localStorage.clear();
        sessionStorage.clear();
    });
    
    describe('Client Initialization', () => {
        test('should initialize when config is enabled', () => {
            expect(supabaseStorage.isAvailable()).toBe(true);
        });
        
        test('should not initialize when config is disabled', () => {
            const disabledConfig = {
                isEnabled: () => false,
                fallbackToLocalStorage: true,
                cacheTimeout: 5000
            };
            const disabledStorage = new SupabaseStorageModel(disabledConfig);
            expect(disabledStorage.isAvailable()).toBe(false);
        });
    });
    
    describe('User Management', () => {
        test('should create user in Supabase', async () => {
            const result = await supabaseStorage.setCurrentUser('TestUser');
            
            expect(result).toBe(true);
            expect(mockClient.data.users.length).toBe(1);
            expect(mockClient.data.users[0].username).toBe('TestUser');
            expect(sessionStorage.getItem('lumi_current_user')).toBe('TestUser');
        });
        
        test('should get current user from session storage', async () => {
            await supabaseStorage.setCurrentUser('CurrentUser');
            const currentUser = await supabaseStorage.getCurrentUser();
            
            expect(currentUser).toBe('CurrentUser');
        });
        
        test('should logout and clear session', async () => {
            await supabaseStorage.setCurrentUser('LogoutUser');
            await supabaseStorage.logout();
            
            expect(await supabaseStorage.getCurrentUser()).toBeNull();
            expect(sessionStorage.getItem('lumi_current_user')).toBeNull();
            expect(sessionStorage.getItem('lumi_user_id')).toBeNull();
        });
        
        test('should reject empty username', async () => {
            const result = await supabaseStorage.setCurrentUser('');
            expect(result).toBe(false);
        });
        
        test('should trim username whitespace', async () => {
            await supabaseStorage.setCurrentUser('  SpacedUser  ');
            const currentUser = await supabaseStorage.getCurrentUser();
            expect(currentUser).toBe('SpacedUser');
        });
    });
    
    describe('Badge Management', () => {
        beforeEach(async () => {
            await supabaseStorage.setCurrentUser('BadgeUser');
        });
        
        test('should add badge to Supabase', async () => {
            const result = await supabaseStorage.addBadge('BadgeUser', 'Test Badge', '🏆');
            
            expect(result).toBe(true);
            expect(mockClient.data.badges.length).toBe(1);
            expect(mockClient.data.badges[0].badge_name).toBe('Test Badge');
            expect(mockClient.data.badges[0].badge_emoji).toBe('🏆');
        });
        
        test('should retrieve badges from Supabase', async () => {
            await supabaseStorage.addBadge('BadgeUser', 'Badge 1', '⭐');
            await supabaseStorage.addBadge('BadgeUser', 'Badge 2', '🎯');
            
            const badges = await supabaseStorage.getBadges('BadgeUser');
            
            expect(badges.length).toBe(2);
            expect(badges.some(b => b.name === 'Badge 1' && b.emoji === '⭐')).toBe(true);
            expect(badges.some(b => b.name === 'Badge 2' && b.emoji === '🎯')).toBe(true);
        });
        
        test('should get badge count', async () => {
            await supabaseStorage.addBadge('BadgeUser', 'Badge 1', '🌟');
            await supabaseStorage.addBadge('BadgeUser', 'Badge 2', '💫');
            await supabaseStorage.addBadge('BadgeUser', 'Badge 3', '✨');
            
            const count = await supabaseStorage.getBadgeCount('BadgeUser');
            expect(count).toBe(3);
        });
        
        test('should return empty array for user with no badges', async () => {
            const badges = await supabaseStorage.getBadges('BadgeUser');
            expect(badges).toEqual([]);
        });
        
        test('should use default emoji when not provided', async () => {
            await supabaseStorage.addBadge('BadgeUser', 'Default Badge');
            
            expect(mockClient.data.badges[0].badge_emoji).toBe('⭐');
        });
    });
    
    describe('Caching', () => {
        beforeEach(async () => {
            await supabaseStorage.setCurrentUser('CacheUser');
        });
        
        test('should cache user IDs', async () => {
            const userId1 = await supabaseStorage.getUserId('CacheUser');
            
            mockClient.reset();
            
            const userId2 = await supabaseStorage.getUserId('CacheUser');
            
            expect(userId1).toBe(userId2);
            expect(mockClient.callLog.length).toBe(0);
        });
        
        test('should cache badges', async () => {
            await supabaseStorage.addBadge('CacheUser', 'Cached Badge', '📦');
            const badges1 = await supabaseStorage.getBadges('CacheUser');
            
            const queryCountBefore = mockClient.callLog.filter(
                log => log.type === 'query' && log.table === 'badges'
            ).length;
            
            const badges2 = await supabaseStorage.getBadges('CacheUser');
            
            const queryCountAfter = mockClient.callLog.filter(
                log => log.type === 'query' && log.table === 'badges'
            ).length;
            
            expect(badges1).toEqual(badges2);
            expect(queryCountAfter).toBe(queryCountBefore);
        });
        
        test('should clear cache on logout', async () => {
            await supabaseStorage.getUserId('CacheUser');
            expect(supabaseStorage.cache.users).not.toBeNull();
            
            await supabaseStorage.logout();
            
            expect(supabaseStorage.cache.users).toBeNull();
            expect(supabaseStorage.cache.badges).toBeNull();
        });
        
        test('should clear cache when adding badge', async () => {
            await supabaseStorage.getBadges('CacheUser');
            expect(supabaseStorage.cache.badges).not.toBeNull();
            
            await supabaseStorage.addBadge('CacheUser', 'New Badge', '🎁');
            
            expect(supabaseStorage.cache.badges).toBeNull();
        });
    });
    
    describe('Fallback to localStorage', () => {
        test('should fall back when Supabase fails', async () => {
            mockClient.rpc = () => Promise.reject(new Error('Network error'));
            
            const result = await supabaseStorage.setCurrentUser('FallbackUser');
            
            expect(result).toBe(true);
            expect(sessionStorage.getItem('lumi_current_user')).toBe('FallbackUser');
        });
        
        test('should fall back for badge operations', async () => {
            supabaseStorage.client = null;
            
            const result = await supabaseStorage.addBadge('LocalUser', 'Local Badge', '💾');
            
            expect(result).toBe(true);
            const storedUsers = JSON.parse(localStorage.getItem('lumi_users'));
            expect(storedUsers.LocalUser.badges.length).toBe(1);
            expect(storedUsers.LocalUser.badges[0].name).toBe('Local Badge');
        });
        
        test('should retrieve badges from localStorage fallback', async () => {
            localStorage.setItem('lumi_users', JSON.stringify({
                'FallbackUser': {
                    badges: [
                        { name: 'Stored Badge', emoji: '🗄️', earnedAt: new Date().toISOString() }
                    ],
                    createdAt: new Date().toISOString()
                }
            }));
            
            const originalGetUserId = supabaseStorage.getUserId;
            supabaseStorage.getUserId = async () => {
                throw new Error('Supabase connection error');
            };
            
            const badges = await supabaseStorage.getBadges('FallbackUser');
            
            expect(badges.length).toBe(1);
            expect(badges[0].name).toBe('Stored Badge');
            expect(badges[0].emoji).toBe('🗄️');
            
            supabaseStorage.getUserId = originalGetUserId;
        });
    });
    
    describe('Error Handling', () => {
        test('should handle user not found gracefully', async () => {
            const userId = await supabaseStorage.getUserId('NonExistentUser');
            expect(userId).toBeNull();
        });
        
        test('should handle badge retrieval for non-existent user', async () => {
            const badges = await supabaseStorage.getBadges('NonExistentUser');
            expect(badges).toEqual([]);
        });
        
        test('should handle corrupted localStorage data', async () => {
            localStorage.setItem('lumi_users', 'invalid json');
            
            supabaseStorage.client = null;
            const badges = await supabaseStorage.getBadges('AnyUser');
            
            expect(badges).toEqual([]);
        });
    });
});

describe('Data Migration Utility', () => {
    let userStorage;
    let supabaseStorage;
    let migrationUtil;
    let mockClient;
    
    beforeEach(() => {
        localStorage.clear();
        sessionStorage.clear();
        
        userStorage = new UserStorageModel();
        
        mockClient = new SupabaseMockClient();
        const config = {
            isEnabled: () => true,
            fallbackToLocalStorage: true,
            cacheTimeout: 5000,
            supabaseUrl: 'https://test.supabase.co',
            supabaseAnonKey: 'test-key'
        };
        
        supabaseStorage = new SupabaseStorageModel(config);
        supabaseStorage.client = mockClient;
        
        migrationUtil = new DataMigrationUtil(userStorage, supabaseStorage);
    });
    
    describe('User Migration', () => {
        test('should migrate user with badges', async () => {
            localStorage.setItem('lumi_users', JSON.stringify({
                'MigrateUser': {
                    badges: [
                        { name: 'Badge 1', emoji: '🥇', earnedAt: '2024-01-01T00:00:00.000Z' },
                        { name: 'Badge 2', emoji: '🥈', earnedAt: '2024-01-02T00:00:00.000Z' }
                    ],
                    createdAt: '2024-01-01T00:00:00.000Z'
                }
            }));
            
            const result = await migrationUtil.migrateUserData('MigrateUser');
            
            expect(result.success).toBe(true);
            expect(result.migratedCount).toBe(2);
            expect(result.failedCount).toBe(0);
            expect(mockClient.data.badges.length).toBe(2);
        });
        
        test('should handle migration of user with no data', async () => {
            const result = await migrationUtil.migrateUserData('NonExistentUser');
            
            expect(result.success).toBe(true);
            expect(result.message).toBe('No data to migrate');
        });
        
        test('should migrate all users', async () => {
            localStorage.setItem('lumi_users', JSON.stringify({
                'User1': { badges: [{ name: 'Badge A', emoji: '🅰️' }], createdAt: new Date().toISOString() },
                'User2': { badges: [{ name: 'Badge B', emoji: '🅱️' }], createdAt: new Date().toISOString() }
            }));
            
            const results = await migrationUtil.migrateAllUsers();
            
            expect(results.length).toBe(2);
            expect(results[0].success).toBe(true);
            expect(results[1].success).toBe(true);
        });
        
        test('should verify successful migration', async () => {
            await userStorage.addBadge('VerifyUser', 'Test Badge', '✅');
            
            await supabaseStorage.setCurrentUser('VerifyUser');
            await supabaseStorage.addBadge('VerifyUser', 'Test Badge', '✅');
            
            const verification = await migrationUtil.verifyMigration('VerifyUser');
            
            expect(verification.success).toBe(true);
            expect(verification.localCount).toBe(1);
            expect(verification.supabaseCount).toBe(1);
        });
        
        test('should detect migration mismatch', async () => {
            await userStorage.addBadge('MismatchUser', 'Badge 1', '1️⃣');
            await userStorage.addBadge('MismatchUser', 'Badge 2', '2️⃣');
            
            await supabaseStorage.setCurrentUser('MismatchUser');
            await supabaseStorage.addBadge('MismatchUser', 'Badge 1', '1️⃣');
            
            const verification = await migrationUtil.verifyMigration('MismatchUser');
            
            expect(verification.success).toBe(false);
            expect(verification.localCount).toBe(2);
            expect(verification.supabaseCount).toBe(1);
        });
    });
});
