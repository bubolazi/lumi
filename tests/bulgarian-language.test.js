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

    test('Letters Level 1 (emoji letter recognition) generates valid emoji and letter', () => {
        model.setLevel(1, 'letters');

        const emojiMap = LettersActivity.getLetterEmojiMap();
        const validLetters = Object.keys(emojiMap);
        const validEmojis = Object.values(emojiMap).flat();

        for (let i = 0; i < 50; i++) {
            const problem = model.generateProblem();

            // Verify problem has required properties
            expect(problem).toHaveProperty('display');
            expect(problem).toHaveProperty('answer');
            expect(problem).toHaveProperty('operation');
            expect(problem).toHaveProperty('letter');

            // Verify operation type
            expect(problem.operation).toBe('emoji_letter_recognition');

            // Verify the emoji is valid
            expect(validEmojis).toContain(problem.display);

            // Verify the letter is valid
            expect(validLetters).toContain(problem.letter);
            expect(problem.answer).toBe(problem.letter);

            // Verify the emoji belongs to the letter
            expect(emojiMap[problem.letter]).toContain(problem.display);
        }
    });

    test('Letters Level 2 (vowels) generates valid vowels', () => {
        model.setLevel(2, 'letters');

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

    test('Letters Level 3 (consonants) generates valid consonants', () => {
        model.setLevel(3, 'letters');

        const consonants = ['Б', 'В', 'Г', 'Д', 'Ж', 'З', 'Й', 'К', 'Л', 'М', 'Н', 'П', 'Р', 'С', 'Т', 'Ф', 'Х', 'Ц', 'Ч', 'Ш', 'Щ'];

        for (let i = 0; i < 50; i++) {
            const problem = model.generateProblem();

            // Verify the generated letter is a valid consonant
            expect(consonants).toContain(problem.display);
        }
    });

    test('Letters Level 4 (all letters) generates valid letters', () => {
        model.setLevel(4, 'letters');

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

    test('checkAnswer accepts correct letter for emoji recognition', () => {
        model.setLevel(1, 'letters');
        const problem = model.generateProblem();

        // Correct letter should be accepted (case insensitive)
        expect(model.checkAnswer(problem.answer)).toBe(true);
        expect(model.checkAnswer(problem.answer.toLowerCase())).toBe(true);
        
        // Wrong letter should be rejected
        const wrongLetter = problem.answer === 'А' ? 'Б' : 'А';
        expect(model.checkAnswer(wrongLetter)).toBe(false);
    });

    test('checkAnswer accepts empty input for regular letters (Enter = correct)', () => {
        model.setLevel(2, 'letters');
        model.generateProblem();

        // Empty input should be treated as correct for non-emoji levels
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

        // 5th correct answer should award badge
        model.updateScore();
        const badge = model.checkBadge();
        expect(badge).not.toBeNull();
        expect(badge).toHaveProperty('fullMessage');
        expect(badge).toHaveProperty('badgeName');
        expect(badge.fullMessage).toContain('Печелиш значка'); // Bulgarian for "You earned a badge:"
    });

    test('badge structure matches controller expectations', () => {
        model.setLevel(1, 'letters');

        // Generate 5 correct answers to earn a badge
        for (let i = 0; i < 5; i++) {
            model.updateScore();
        }

        const badge = model.checkBadge();

        // Verify badge has the structure the controller expects
        expect(badge).not.toBeNull();
        expect(typeof badge).toBe('object');
        expect(badge).toHaveProperty('badgeName');
        expect(badge).toHaveProperty('fullMessage');

        // Verify badgeName is a string with an adjective and animal
        expect(typeof badge.badgeName).toBe('string');
        expect(badge.badgeName.split(' ').length).toBe(2); // Should be "Adjective Animal"

        // Verify fullMessage contains the badge template and badgeName
        expect(badge.fullMessage).toContain('Печелиш значка');
        expect(badge.fullMessage).toContain(badge.badgeName);
    });

    test('badge resets streak after awarding', () => {
        model.setLevel(1, 'letters');

        // Earn first badge
        for (let i = 0; i < 5; i++) {
            model.updateScore();
        }
        expect(model.checkBadge()).not.toBeNull();
        expect(model.correctAnswersStreak).toBe(0); // Streak should reset

        // Verify no badge on next answer
        model.updateScore();
        expect(model.checkBadge()).toBeNull();

        // Earn second badge
        for (let i = 0; i < 4; i++) {
            model.updateScore();
        }
        expect(model.checkBadge()).not.toBeNull();
    });
});
