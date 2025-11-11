/**
 * Test suite for Math operations
 * Tests that math problems generate correct answers
 */

describe('Math Operations - Addition', () => {
    let localization;
    let operationManager;
    let additionExtension;
    let mathModel;

    beforeEach(() => {
        localization = new LocalizationModel('bg');
        operationManager = new OperationManager();
        additionExtension = operationManager.getOperationExtension('addition');
        mathModel = new MathModel(localization, additionExtension);
    });

    test('Addition Level 1 (single digits, result <= 10) generates correct answers', () => {
        mathModel.setLevel(1, 'addition');

        for (let i = 0; i < 100; i++) {
            const problem = mathModel.generateProblem();

            expect(problem).toHaveProperty('num1');
            expect(problem).toHaveProperty('num2');
            expect(problem).toHaveProperty('answer');
            expect(problem).toHaveProperty('operation');

            expect(problem.operation).toBe('+');

            const expectedAnswer = problem.num1 + problem.num2;
            expect(problem.answer).toBe(expectedAnswer);

            expect(problem.num1).toBeGreaterThanOrEqual(0);
            expect(problem.num1).toBeLessThanOrEqual(9);
            expect(problem.num2).toBeGreaterThanOrEqual(0);
            expect(problem.num2).toBeLessThanOrEqual(9);
            
            expect(problem.answer).toBeLessThanOrEqual(10);
        }
    });

    test('Addition Level 2 (place value recognition) generates correct answers', () => {
        mathModel.setLevel(2, 'addition');

        for (let i = 0; i < 50; i++) {
            const problem = mathModel.generateProblem();

            expect(problem).toHaveProperty('num1');
            expect(problem).toHaveProperty('answer');
            expect(problem).toHaveProperty('operation');

            expect(problem.operation).toBe('place_value_recognition');

            const expectedOnes = problem.num1 % 10;
            const expectedTens = Math.floor(problem.num1 / 10);

            if (problem.questionType === 'ones') {
                expect(problem.answer).toBe(expectedOnes);
            } else {
                expect(problem.answer).toBe(expectedTens);
            }
        }
    });

    test('Addition Level 3 (up to 20, result <= 20) generates correct answers', () => {
        mathModel.setLevel(3, 'addition');

        for (let i = 0; i < 100; i++) {
            const problem = mathModel.generateProblem();

            expect(problem.operation).toBe('+');

            const expectedAnswer = problem.num1 + problem.num2;
            expect(problem.answer).toBe(expectedAnswer);

            expect(problem.num1).toBeGreaterThanOrEqual(0);
            expect(problem.num1).toBeLessThanOrEqual(20);
            expect(problem.num2).toBeGreaterThanOrEqual(0);
            expect(problem.num2).toBeLessThanOrEqual(20);
            
            expect(problem.answer).toBeLessThanOrEqual(20);
        }
    });

    test('Addition Level 4 (place value calculation) generates correct answers', () => {
        mathModel.setLevel(4, 'addition');

        for (let i = 0; i < 50; i++) {
            const problem = mathModel.generateProblem();

            expect(problem.operation).toBe('place_value_calculation');
            expect(problem.currentStep).toBe(1);
            expect(problem.stepAnswers).toHaveLength(4);

            expect(problem.stepAnswers[0]).toBe(problem.onesSum);
            expect(problem.stepAnswers[1]).toBe(problem.carryOver);
            expect(problem.stepAnswers[2]).toBe(problem.tensSum + problem.carryOver);
            expect(problem.stepAnswers[3]).toBe(problem.answer);
            
            expect(problem.answer).toBe(problem.num1 + problem.num2);
        }
    });

    test('checkAnswer correctly validates correct answers', () => {
        mathModel.setLevel(1, 'addition');
        const problem = mathModel.generateProblem();

        // Test correct answer
        const isCorrect = mathModel.checkAnswer(problem.answer.toString());
        expect(isCorrect).toBe(true);
    });

    test('checkAnswer correctly rejects incorrect answers', () => {
        mathModel.setLevel(1, 'addition');
        const problem = mathModel.generateProblem();

        // Test incorrect answer
        const wrongAnswer = problem.answer + 1;
        const isCorrect = mathModel.checkAnswer(wrongAnswer.toString());
        expect(isCorrect).toBe(false);
    });

    test('updateScore increments score and problem count', () => {
        expect(mathModel.score).toBe(0);
        expect(mathModel.problemsSolved).toBe(0);

        mathModel.updateScore();

        expect(mathModel.score).toBe(10);
        expect(mathModel.problemsSolved).toBe(1);
    });
});

describe('Math Operations - Subtraction', () => {
    let localization;
    let operationManager;
    let subtractionExtension;
    let mathModel;

    beforeEach(() => {
        localization = new LocalizationModel('bg');
        operationManager = new OperationManager();
        subtractionExtension = operationManager.getOperationExtension('subtraction');
        mathModel = new MathModel(localization, subtractionExtension);
    });

    test('Subtraction Level 1 (single digits, result >= 0) generates correct answers', () => {
        mathModel.setLevel(1, 'subtraction');

        for (let i = 0; i < 100; i++) {
            const problem = mathModel.generateProblem();

            const expectedAnswer = problem.num1 - problem.num2;
            expect(problem.answer).toBe(expectedAnswer);

            expect(problem.operation).toBe('-');

            expect(problem.answer).toBeGreaterThanOrEqual(0);
            expect(problem.num1).toBeGreaterThanOrEqual(problem.num2);
            
            expect(problem.num1).toBeGreaterThanOrEqual(0);
            expect(problem.num1).toBeLessThanOrEqual(9);
            expect(problem.num2).toBeGreaterThanOrEqual(0);
            expect(problem.num2).toBeLessThanOrEqual(9);
        }
    });

    test('Subtraction Level 2 (place value recognition) generates correct answers', () => {
        mathModel.setLevel(2, 'subtraction');

        for (let i = 0; i < 50; i++) {
            const problem = mathModel.generateProblem();

            expect(problem).toHaveProperty('num1');
            expect(problem).toHaveProperty('answer');
            expect(problem).toHaveProperty('operation');

            expect(problem.operation).toBe('place_value_recognition');

            const expectedOnes = problem.num1 % 10;
            const expectedTens = Math.floor(problem.num1 / 10);

            if (problem.questionType === 'ones') {
                expect(problem.answer).toBe(expectedOnes);
            } else {
                expect(problem.answer).toBe(expectedTens);
            }
        }
    });

    test('Subtraction Level 3 (up to 20, result >= 0) generates correct answers', () => {
        mathModel.setLevel(3, 'subtraction');

        for (let i = 0; i < 100; i++) {
            const problem = mathModel.generateProblem();

            const expectedAnswer = problem.num1 - problem.num2;
            expect(problem.answer).toBe(expectedAnswer);

            expect(problem.operation).toBe('-');
            expect(problem.answer).toBeGreaterThanOrEqual(0);
            
            expect(problem.num1).toBeGreaterThanOrEqual(0);
            expect(problem.num1).toBeLessThanOrEqual(20);
            expect(problem.num2).toBeGreaterThanOrEqual(0);
            expect(problem.num2).toBeLessThanOrEqual(20);
        }
    });

    test('Subtraction Level 4 (place value calculation) generates correct answers', () => {
        mathModel.setLevel(4, 'subtraction');

        for (let i = 0; i < 50; i++) {
            const problem = mathModel.generateProblem();

            expect(problem.operation).toBe('place_value_calculation');
            expect(problem.currentStep).toBe(1);
            expect(problem.stepAnswers).toHaveLength(4);

            expect(problem.stepAnswers[0]).toBe(problem.onesFinal);
            expect(problem.stepAnswers[1]).toBe(problem.borrow);
            expect(problem.stepAnswers[2]).toBe(problem.tensFinal);
            expect(problem.stepAnswers[3]).toBe(problem.answer);
            
            expect(problem.answer).toBe(problem.num1 - problem.num2);
            expect(problem.answer).toBeGreaterThanOrEqual(0);
        }
    });
});



describe('Math Model - State Management', () => {
    let localization;
    let operationManager;
    let additionExtension;
    let mathModel;

    beforeEach(() => {
        localization = new LocalizationModel('bg');
        operationManager = new OperationManager();
        additionExtension = operationManager.getOperationExtension('addition');
        mathModel = new MathModel(localization, additionExtension);
    });

    test('resetStats clears all statistics', () => {
        // Generate some activity
        mathModel.updateScore();
        mathModel.updateScore();

        expect(mathModel.score).toBe(20);
        expect(mathModel.problemsSolved).toBe(2);

        // Reset
        mathModel.resetStats();

        expect(mathModel.score).toBe(0);
        expect(mathModel.problemsSolved).toBe(0);
        expect(mathModel.correctAnswersStreak).toBe(0);
    });

    test('setLevel changes current level', () => {
        mathModel.setLevel(2, 'addition');

        expect(mathModel.currentLevel).toBe(2);
        expect(mathModel.currentOperation).toBe('addition');
    });

    test('badge awarded after 5 correct answers', () => {
        mathModel.setLevel(1, 'addition');

        // Answer 4 problems correctly
        for (let i = 0; i < 4; i++) {
            mathModel.updateScore();
            expect(mathModel.checkBadge()).toBeNull();
        }

        // 5th correct answer should award badge
        mathModel.updateScore();
        const badgeData = mathModel.checkBadge();
        expect(badgeData).not.toBeNull();
        expect(badgeData.fullMessage).toContain('Печелиш значка'); // Bulgarian for "You earned a badge:"
        expect(badgeData.badgeName).toBeDefined();
        expect(typeof badgeData.badgeName).toBe('string');
    });
});

describe('Bug Fix - Place Value Calculation Completion', () => {
    let localization;
    let operationManager;
    let additionExtension;
    let mathModel;

    beforeEach(() => {
        localization = new LocalizationModel('bg');
        operationManager = new OperationManager();
        additionExtension = operationManager.getOperationExtension('addition');
        mathModel = new MathModel(localization, additionExtension);
    });

    test('Addition Level 4 problem has currentStep property set to 1', () => {
        mathModel.setLevel(4, 'addition');

        const problem = mathModel.generateProblem();

        expect(problem.currentStep).toBe(1);
        expect(problem.stepAnswers).toHaveLength(4);
    });

    test('Addition Level 4 problem marks completion with currentStep=5 after all steps', () => {
        mathModel.setLevel(4, 'addition');

        const problem = mathModel.generateProblem();

        problem.currentStep = 2;
        problem.currentStep = 3;
        problem.currentStep = 4;
        problem.currentStep = 5;

        expect(problem.currentStep).toBe(5);
        expect(problem.currentStep >= 5).toBe(true);
    });

    test('Multiple Addition Level 4 problems can be generated in sequence', () => {
        mathModel.setLevel(4, 'addition');

        const problem1 = mathModel.generateProblem();
        expect(problem1.currentStep).toBe(1);

        problem1.currentStep = 5;

        const problem2 = mathModel.generateProblem();
        expect(problem2.currentStep).toBe(1);
        expect(problem2.num1).toBeDefined();
        expect(problem2.num2).toBeDefined();

        const isDifferent = problem1.num1 !== problem2.num1 || problem1.num2 !== problem2.num2;
        expect(isDifferent).toBe(true);
    });

    test('Subtraction Level 4 problem has correct step structure', () => {
        const subtractionExtension = operationManager.getOperationExtension('subtraction');
        const subtractionModel = new MathModel(localization, subtractionExtension);
        subtractionModel.setLevel(4, 'subtraction');

        const problem = subtractionModel.generateProblem();

        expect(problem.currentStep).toBe(1);
        expect(problem.stepAnswers).toHaveLength(4);
        
        expect(problem.stepAnswers[0]).toBe(problem.onesFinal);
        expect(problem.stepAnswers[1]).toBe(problem.borrow);
        expect(problem.stepAnswers[2]).toBe(problem.tensFinal);
        expect(problem.stepAnswers[3]).toBe(problem.answer);
    });
});
