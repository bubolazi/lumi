// Model: Bulgarian Language learning - Parent-controlled input
class BulgarianLanguageModel {
    constructor(localization, activityExtension) {
        this.localization = localization;
        this.activityExtension = activityExtension;
        this.currentLevel = 1;
        this.currentActivity = activityExtension.getOperationKey().toLowerCase();
        this.score = 0;
        this.problemsSolved = 0;
        this.correctAnswersStreak = 0; // Track consecutive correct answers for badges
        this.currentProblem = null;
        
        // Get levels from the activity extension
        this.levels = activityExtension.getLevels();
    }
    
    // Generate a problem (letter, syllable, or word to read)
    generateProblem() {
        this.currentProblem = this.activityExtension.generateProblem(this.currentLevel);
        return this.currentProblem;
    }
    
    // Check if the parent input is correct (Enter = correct, Backspace handled separately)
    checkAnswer(userAnswer) {
        // For Bulgarian language, empty input (Enter key) means correct
        // Wrong answers are submitted via Backspace key and handled separately in the controller
        return userAnswer === '' || userAnswer === null || userAnswer === undefined;
    }
    
    // Update score for correct answer
    updateScore() {
        this.score += 10;
        this.problemsSolved++;
        this.correctAnswersStreak++;
    }
    
    // Reset game statistics
    resetStats() {
        this.score = 0;
        this.problemsSolved = 0;
        this.correctAnswersStreak = 0;
    }
    
    // Set current level and activity
    setLevel(level, activity) {
        this.currentLevel = level;
        this.currentActivity = activity;
    }
    
    // Get a random reward message
    getRandomRewardMessage() {
        const rewardMessageKeys = this.activityExtension.getRewardMessages();
        const messages = this.localization.tArray(rewardMessageKeys[0]);
        return messages[Math.floor(Math.random() * messages.length)];
    }
    
    // Check if user earned a badge
    checkBadge() {
        const total = this.problemsSolved;
        const visualBadges = this.localization.getVisualBadges();
        
        // Check for visual badge milestones
        if (visualBadges.novice && total === visualBadges.novice.threshold) {
            return { type: 'visual', badge: visualBadges.novice };
        }
        if (visualBadges.learner && total === visualBadges.learner.threshold) {
            return { type: 'visual', badge: visualBadges.learner };
        }
        if (visualBadges.achiever && total === visualBadges.achiever.threshold) {
            return { type: 'visual', badge: visualBadges.achiever };
        }
        if (visualBadges.expert && total === visualBadges.expert.threshold) {
            return { type: 'visual', badge: visualBadges.expert };
        }
        if (visualBadges.master && total === visualBadges.master.threshold) {
            return { type: 'visual', badge: visualBadges.master };
        }
        
        // Otherwise check for text badge (every 5)
        if (this.correctAnswersStreak > 0 && this.correctAnswersStreak % 5 === 0) {
            // Reset streak after awarding badge
            this.correctAnswersStreak = 0;
            return { type: 'text', message: this.generateBadgeMessage() };
        }
        
        return null;
    }
    
    // Generate a random badge message with grammatically correct gender matching
    generateBadgeMessage() {
        const badgeTemplate = this.localization.t('BADGE_MESSAGE');
        
        // Randomly select a gender category
        const genders = ['NEUTER', 'FEMININE', 'MASCULINE'];
        const randomGender = genders[Math.floor(Math.random() * genders.length)];
        
        // Get animals and adjectives for the selected gender
        const animals = this.localization.tArray(`BADGE_ANIMALS_${randomGender}`);
        const adjectives = this.localization.tArray(`BADGE_ADJECTIVES_${randomGender}`);
        
        // Select random animal and adjective from the same gender category
        const randomAnimal = animals[Math.floor(Math.random() * animals.length)];
        const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)];
        
        return `${badgeTemplate} ${randomAdjective} ${randomAnimal}`;
    }
    
    // Get localized level descriptions
    getLocalizedLevels() {
        const localizedLevels = {};
        Object.keys(this.levels).forEach(levelNum => {
            const level = this.levels[levelNum];
            localizedLevels[levelNum] = {
                ...level,
                description: this.localization.t(level.descriptionKey)
            };
        });
        return localizedLevels;
    }
    
    // Get current game state
    getGameState() {
        return {
            level: this.currentLevel,
            operation: this.currentActivity,
            operationKey: this.activityExtension.getOperationKey(),
            score: this.score,
            problemsSolved: this.problemsSolved,
            currentProblem: this.currentProblem,
            levels: this.getLocalizedLevels()
        };
    }
}
