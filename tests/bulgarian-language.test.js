/**
 * Test suite for Bulgarian Language activities
 * Tests that Bulgarian language activities generate valid content
 */

describe('Bulgarian Language - Letters Activity', () => {
    let localization;
    let activityManager;
    let lettersExtension;
    let model;

    beforeEach(() => {
        localization = new LocalizationModel('bg');
        activityManager = new BulgarianActivityManager();
        lettersExtension = activityManager.getOperationExtension('letters');
        model = new BulgarianLanguageModel(localization, lettersExtension);
    });

    test('Letters Level 1 (vowels) generates valid vowels', () => {
        model.setLevel(1, 'letters');
        
        const vowels = ['А', 'Е', 'И', 'О', 'У', 'Ъ', 'Ю', 'Я'];
        
        for (let i = 0; i < 50; i++) {
            const problem = model.generateProblem();
            
            // Verify problem has required properties
            expect(problem).toHaveProperty('display');
            expect(problem).toHaveProperty('operation');
            
            // Verify operation type
            expect(problem.operation).toBe('read');
            
            // Verify the generated letter is a valid vowel
            expect(vowels).toContain(problem.display);
        }
    });

    test('Letters Level 2 (consonants) generates valid consonants', () => {
        model.setLevel(2, 'letters');
        
        const consonants = ['Б', 'В', 'Г', 'Д', 'Ж', 'З', 'Й', 'К', 'Л', 'М', 'Н', 'П', 'Р', 'С', 'Т', 'Ф', 'Х', 'Ц', 'Ч', 'Ш', 'Щ'];
        
        for (let i = 0; i < 50; i++) {
            const problem = model.generateProblem();
            
            // Verify the generated letter is a valid consonant
            expect(consonants).toContain(problem.display);
        }
    });

    test('Letters Level 3 (all letters) generates valid letters', () => {
        model.setLevel(3, 'letters');
        
        const allLetters = ['А', 'Б', 'В', 'Г', 'Д', 'Е', 'Ж', 'З', 'И', 'Й', 'К', 'Л', 'М', 'Н', 'О', 'П', 'Р', 'С', 'Т', 'У', 'Ф', 'Х', 'Ц', 'Ч', 'Ш', 'Щ', 'Ъ', 'Ю', 'Я'];
        
        for (let i = 0; i < 50; i++) {
            const problem = model.generateProblem();
            
            // Verify the generated letter is valid
            expect(allLetters).toContain(problem.display);
        }
    });
});

describe('Bulgarian Language - Syllables Activity', () => {
    let localization;
    let activityManager;
    let syllablesExtension;
    let model;

    beforeEach(() => {
        localization = new LocalizationModel('bg');
        activityManager = new BulgarianActivityManager();
        syllablesExtension = activityManager.getOperationExtension('syllables');
        model = new BulgarianLanguageModel(localization, syllablesExtension);
    });

    test('Syllables Level 1 generates valid syllables', () => {
        model.setLevel(1, 'syllables');
        
        for (let i = 0; i < 50; i++) {
            const problem = model.generateProblem();
            
            // Verify problem has required properties
            expect(problem).toHaveProperty('display');
            expect(problem).toHaveProperty('operation');
            
            // Verify operation type
            expect(problem.operation).toBe('read');
            
            // Verify syllable is not empty and has reasonable length
            expect(problem.display.length).toBeGreaterThan(0);
            expect(problem.display.length).toBeLessThanOrEqual(4);
        }
    });

    test('Syllables Level 2 generates valid syllables', () => {
        model.setLevel(2, 'syllables');
        
        for (let i = 0; i < 50; i++) {
            const problem = model.generateProblem();
            
            // Verify syllable is valid
            expect(problem.display.length).toBeGreaterThan(0);
            expect(problem.operation).toBe('read');
        }
    });

    test('Syllables Level 3 generates valid syllables', () => {
        model.setLevel(3, 'syllables');
        
        for (let i = 0; i < 50; i++) {
            const problem = model.generateProblem();
            
            // Verify syllable is valid
            expect(problem.display.length).toBeGreaterThan(0);
            expect(problem.operation).toBe('read');
        }
    });
});

describe('Bulgarian Language - Words Activity', () => {
    let localization;
    let activityManager;
    let wordsExtension;
    let model;

    beforeEach(() => {
        localization = new LocalizationModel('bg');
        activityManager = new BulgarianActivityManager();
        wordsExtension = activityManager.getOperationExtension('words');
        model = new BulgarianLanguageModel(localization, wordsExtension);
    });

    test('Words Level 1 (2 syllables) generates valid words', () => {
        model.setLevel(1, 'words');
        
        for (let i = 0; i < 30; i++) {
            const problem = model.generateProblem();
            
            // Verify problem has required properties
            expect(problem).toHaveProperty('display');
            expect(problem).toHaveProperty('operation');
            
            // Verify operation type
            expect(problem.operation).toBe('read');
            
            // Verify word is not empty and has reasonable length
            expect(problem.display.length).toBeGreaterThan(0);
        }
    });

    test('Words Level 2 (3 syllables) generates valid words', () => {
        model.setLevel(2, 'words');
        
        for (let i = 0; i < 30; i++) {
            const problem = model.generateProblem();
            
            // Verify word is valid
            expect(problem.display.length).toBeGreaterThan(0);
            expect(problem.operation).toBe('read');
        }
    });

    test('Words Level 3 (4+ syllables) generates valid words', () => {
        model.setLevel(3, 'words');
        
        for (let i = 0; i < 30; i++) {
            const problem = model.generateProblem();
            
            // Verify word is valid
            expect(problem.display.length).toBeGreaterThan(0);
            expect(problem.operation).toBe('read');
        }
    });
});

describe('Bulgarian Language Model - Answer Validation', () => {
    let localization;
    let activityManager;
    let lettersExtension;
    let model;

    beforeEach(() => {
        localization = new LocalizationModel('bg');
        activityManager = new BulgarianActivityManager();
        lettersExtension = activityManager.getOperationExtension('letters');
        model = new BulgarianLanguageModel(localization, lettersExtension);
    });

    test('checkAnswer accepts empty input (Enter = correct)', () => {
        model.setLevel(1, 'letters');
        model.generateProblem();
        
        // Empty input should be treated as correct
        expect(model.checkAnswer('')).toBe(true);
        expect(model.checkAnswer(null)).toBe(true);
        expect(model.checkAnswer(undefined)).toBe(true);
    });

    test('updateScore increments score and problem count', () => {
        expect(model.score).toBe(0);
        expect(model.problemsSolved).toBe(0);
        
        model.updateScore();
        
        expect(model.score).toBe(10);
        expect(model.problemsSolved).toBe(1);
    });

    test('resetStats clears all statistics', () => {
        // Generate some activity
        model.updateScore();
        model.updateScore();
        
        expect(model.score).toBe(20);
        expect(model.problemsSolved).toBe(2);
        
        // Reset
        model.resetStats();
        
        expect(model.score).toBe(0);
        expect(model.problemsSolved).toBe(0);
        expect(model.correctAnswersStreak).toBe(0);
    });

    test('badge awarded after 5 correct answers', () => {
        model.setLevel(1, 'letters');
        
        // Answer 4 problems correctly
        for (let i = 0; i < 4; i++) {
            model.updateScore();
            expect(model.checkBadge()).toBeNull();
        }
        
        // 5th correct answer should award a visual badge now (at milestone)
        model.updateScore();
        const badge = model.checkBadge();
        expect(badge).not.toBeNull();
        expect(badge.type).toBe('visual');
        expect(badge.badge.icon).toBe('🌱');
    });
});
