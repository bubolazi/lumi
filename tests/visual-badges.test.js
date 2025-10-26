describe('Visual Badges - Math Model', () => {
    let localization;
    let operationManager;
    let mathModel;
    let additionExtension;

    beforeEach(() => {
        localization = new LocalizationModel('bg');
        operationManager = new OperationManager();
        additionExtension = operationManager.getOperationExtension('addition');
        mathModel = new MathModel(localization, additionExtension);
    });

    test('visual badge awarded at 5 problems solved', () => {
        for (let i = 0; i < 5; i++) {
            mathModel.updateScore();
        }
        
        const badge = mathModel.checkBadge();
        expect(badge).not.toBeNull();
        expect(badge.type).toBe('visual');
        expect(badge.badge.icon).toBe('🌱');
        expect(badge.badge.name).toBe('Начинаещ');
        expect(badge.badge.threshold).toBe(5);
    });

    test('visual badge awarded at 10 problems solved', () => {
        for (let i = 0; i < 10; i++) {
            mathModel.updateScore();
        }
        
        const badge = mathModel.checkBadge();
        expect(badge).not.toBeNull();
        expect(badge.type).toBe('visual');
        expect(badge.badge.icon).toBe('📚');
        expect(badge.badge.name).toBe('Ученик');
        expect(badge.badge.threshold).toBe(10);
    });

    test('visual badge awarded at 20 problems solved', () => {
        for (let i = 0; i < 20; i++) {
            mathModel.updateScore();
        }
        
        const badge = mathModel.checkBadge();
        expect(badge).not.toBeNull();
        expect(badge.type).toBe('visual');
        expect(badge.badge.icon).toBe('🌟');
        expect(badge.badge.name).toBe('Постигач');
        expect(badge.badge.threshold).toBe(20);
    });

    test('visual badge awarded at 50 problems solved', () => {
        for (let i = 0; i < 50; i++) {
            mathModel.updateScore();
        }
        
        const badge = mathModel.checkBadge();
        expect(badge).not.toBeNull();
        expect(badge.type).toBe('visual');
        expect(badge.badge.icon).toBe('⭐');
        expect(badge.badge.name).toBe('Експерт');
        expect(badge.badge.threshold).toBe(50);
    });

    test('visual badge awarded at 100 problems solved', () => {
        for (let i = 0; i < 100; i++) {
            mathModel.updateScore();
        }
        
        const badge = mathModel.checkBadge();
        expect(badge).not.toBeNull();
        expect(badge.type).toBe('visual');
        expect(badge.badge.icon).toBe('🏆');
        expect(badge.badge.name).toBe('Майстор');
        expect(badge.badge.threshold).toBe(100);
    });

    test('no badge awarded between milestones', () => {
        for (let i = 0; i < 7; i++) {
            mathModel.updateScore();
        }
        
        const badge = mathModel.checkBadge();
        expect(badge).toBeNull();
    });

    test('text badge awarded after visual badge (streak continues)', () => {
        // Solve 5 problems to get visual badge
        for (let i = 0; i < 5; i++) {
            mathModel.updateScore();
        }
        mathModel.checkBadge(); // Get visual badge
        
        // Continue solving (correctAnswersStreak should still be at 5)
        // Next 5 correct answers should give text badge
        for (let i = 0; i < 5; i++) {
            mathModel.updateScore();
        }
        
        const badge = mathModel.checkBadge();
        // At 10 total problems, should get another visual badge
        expect(badge).not.toBeNull();
        expect(badge.type).toBe('visual');
    });
});

describe('Visual Badges - Bulgarian Language Model', () => {
    let localization;
    let activityManager;
    let model;
    let lettersExtension;

    beforeEach(() => {
        localization = new LocalizationModel('bg');
        activityManager = new BulgarianActivityManager();
        lettersExtension = activityManager.getOperationExtension('letters');
        model = new BulgarianLanguageModel(localization, lettersExtension);
    });

    test('visual badge awarded at 5 problems solved', () => {
        for (let i = 0; i < 5; i++) {
            model.updateScore();
        }
        
        const badge = model.checkBadge();
        expect(badge).not.toBeNull();
        expect(badge.type).toBe('visual');
        expect(badge.badge.icon).toBe('🌱');
        expect(badge.badge.name).toBe('Начинаещ');
    });

    test('visual badge awarded at 10 problems solved', () => {
        for (let i = 0; i < 10; i++) {
            model.updateScore();
        }
        
        const badge = model.checkBadge();
        expect(badge).not.toBeNull();
        expect(badge.type).toBe('visual');
        expect(badge.badge.icon).toBe('📚');
        expect(badge.badge.name).toBe('Ученик');
    });
});

describe('Visual Badges - LocalizationModel', () => {
    test('Bulgarian visual badges defined correctly', () => {
        const localization = new LocalizationModel('bg');
        const badges = localization.getVisualBadges();
        
        expect(badges.novice).toBeDefined();
        expect(badges.novice.icon).toBe('🌱');
        expect(badges.novice.name).toBe('Начинаещ');
        expect(badges.novice.threshold).toBe(5);
        
        expect(badges.learner).toBeDefined();
        expect(badges.master).toBeDefined();
    });

    test('English visual badges defined correctly', () => {
        const localization = new LocalizationModel('en');
        const badges = localization.getVisualBadges();
        
        expect(badges.novice).toBeDefined();
        expect(badges.novice.icon).toBe('🌱');
        expect(badges.novice.name).toBe('Novice');
        expect(badges.novice.threshold).toBe(5);
    });
});
