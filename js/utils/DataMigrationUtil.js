class DataMigrationUtil {
    constructor(userStorage, supabaseStorage) {
        this.userStorage = userStorage;
        this.supabaseStorage = supabaseStorage;
    }
    
    async migrateUserData(username) {
        try {
            console.log(`Starting migration for user: ${username}`);
            
            const localUsers = this.userStorage.getAllUsers();
            const userData = localUsers[username];
            
            if (!userData) {
                console.log('No data to migrate');
                return { success: true, message: 'No data to migrate' };
            }
            
            const success = await this.supabaseStorage.setCurrentUser(username);
            if (!success) {
                throw new Error('Failed to create user in Supabase');
            }
            
            const badges = userData.badges || [];
            console.log(`Migrating ${badges.length} badges...`);
            
            let migratedCount = 0;
            let failedCount = 0;
            
            for (const badge of badges) {
                const badgeName = typeof badge === 'string' ? badge : badge.name;
                const badgeEmoji = typeof badge === 'string' ? '⭐' : (badge.emoji || '⭐');
                
                const result = await this.supabaseStorage.addBadge(
                    username,
                    badgeName,
                    badgeEmoji
                );
                
                if (result) {
                    migratedCount++;
                } else {
                    failedCount++;
                }
            }
            
            console.log(`Migration complete: ${migratedCount} succeeded, ${failedCount} failed`);
            
            return {
                success: true,
                migratedCount,
                failedCount,
                message: `Successfully migrated ${migratedCount} badges`
            };
            
        } catch (error) {
            console.error('Migration failed:', error);
            return {
                success: false,
                error: error.message,
                message: 'Migration failed'
            };
        }
    }
    
    async migrateAllUsers() {
        const localUsers = this.userStorage.getAllUsers();
        const usernames = Object.keys(localUsers);
        
        console.log(`Starting migration for ${usernames.length} users...`);
        
        const results = [];
        for (const username of usernames) {
            const result = await this.migrateUserData(username);
            results.push({ username, ...result });
        }
        
        return results;
    }
    
    async verifyMigration(username) {
        try {
            const localBadges = await this.userStorage.getBadges(username);
            const supabaseBadges = await this.supabaseStorage.getBadges(username);
            
            const localCount = localBadges.length;
            const supabaseCount = supabaseBadges.length;
            
            console.log(`Verification for ${username}:`);
            console.log(`  localStorage: ${localCount} badges`);
            console.log(`  Supabase: ${supabaseCount} badges`);
            
            return {
                success: localCount === supabaseCount,
                localCount,
                supabaseCount,
                message: localCount === supabaseCount 
                    ? 'Migration verified successfully'
                    : `Mismatch: ${localCount} in localStorage vs ${supabaseCount} in Supabase`
            };
            
        } catch (error) {
            console.error('Verification failed:', error);
            return {
                success: false,
                error: error.message,
                message: 'Verification failed'
            };
        }
    }
}
