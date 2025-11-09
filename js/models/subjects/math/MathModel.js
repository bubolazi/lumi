// Model: Data and business logic for math practice - Generic operation support
class MathModel {
    constructor(localization, operationExtension) {
        this.localization = localization;
        this.operationExtension = operationExtension;
        this.currentLevel = 1;
        this.currentOperation = operationExtension.getOperationKey().toLowerCase();
        this.score = 0;
        this.problemsSolved = 0;
        this.correctAnswersStreak = 0; // Track consecutive correct answers for badges
        this.currentProblem = null;
        
        // Get levels from the operation extension
        this.levels = operationExtension.getLevels();
    }
    
    // Generate a math problem based on current level and operation
    generateProblem() {
        // Delegate problem generation to the operation extension
        this.currentProblem = this.operationExtension.generateProblem(this.currentLevel);
        return this.currentProblem;
    }
    
    // Check if the user's answer is correct
    checkAnswer(userAnswer) {
        return parseInt(userAnswer) === this.currentProblem.answer;
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
    
    // Set current level and operation
    setLevel(level, operation) {
        this.currentLevel = level;
        this.currentOperation = operation;
    }
    
    // Get a random reward message
    getRandomRewardMessage() {
        const rewardMessageKeys = this.operationExtension.getRewardMessages();
        const messages = this.localization.tArray(rewardMessageKeys[0]);
        return messages[Math.floor(Math.random() * messages.length)];
    }
    
    // Check if user earned a badge (every 5 correct answers)
    checkBadge() {
        if (this.correctAnswersStreak > 0 && this.correctAnswersStreak % 5 === 0) {
            // Reset streak after awarding badge
            this.correctAnswersStreak = 0;
            return this.generateBadgeMessage();
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
        
        const badgeName = `${randomAdjective} ${randomAnimal}`;
        return {
            fullMessage: `${badgeTemplate} ${badgeName}`,
            badgeName: badgeName
        };
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
            operation: this.currentOperation,
            operationKey: this.operationExtension.getOperationKey(),
            score: this.score,
            problemsSolved: this.problemsSolved,
            currentProblem: this.currentProblem,
            levels: this.getLocalizedLevels()
        };
    }
    
    // Remove the randomInt method as it's now handled by extensions
}