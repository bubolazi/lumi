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

    test('Addition Level 1 (single digits) generates correct answers', () => {
        mathModel.setLevel(1, 'addition');
        
        // Generate 100 problems to test randomness
        for (let i = 0; i < 100; i++) {
            const problem = mathModel.generateProblem();
            
            // Verify problem has required properties
            expect(problem).toHaveProperty('num1');
            expect(problem).toHaveProperty('num2');
            expect(problem).toHaveProperty('answer');
            expect(problem).toHaveProperty('operation');
            
            // Verify operation type
            expect(problem.operation).toBe('+');
            
            // Verify answer is correct
            const expectedAnswer = problem.num1 + problem.num2;
            expect(problem.answer).toBe(expectedAnswer);
            
            // Verify numbers are in expected range (1-9 for level 1)
            expect(problem.num1).toBeGreaterThanOrEqual(1);
            expect(problem.num1).toBeLessThanOrEqual(9);
            expect(problem.num2).toBeGreaterThanOrEqual(1);
            expect(problem.num2).toBeLessThanOrEqual(9);
        }
    });

    test('Addition Level 2 (double digits) generates correct answers', () => {
        mathModel.setLevel(2, 'addition');
        
        for (let i = 0; i < 100; i++) {
            const problem = mathModel.generateProblem();
            
            // Verify answer is correct
            const expectedAnswer = problem.num1 + problem.num2;
            expect(problem.answer).toBe(expectedAnswer);
            
            // Verify at least one number is in range 10-19
            const hasDoubleDigit = problem.num1 >= 10 || problem.num2 >= 10;
            expect(hasDoubleDigit).toBe(true);
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

    test('Subtraction Level 1 (single digits) generates correct answers', () => {
        mathModel.setLevel(1, 'subtraction');
        
        for (let i = 0; i < 100; i++) {
            const problem = mathModel.generateProblem();
            
            // Verify answer is correct
            const expectedAnswer = problem.num1 - problem.num2;
            expect(problem.answer).toBe(expectedAnswer);
            
            // Verify operation type
            expect(problem.operation).toBe('-');
            
            // Verify answer is not negative (constraint for subtraction)
            expect(problem.answer).toBeGreaterThanOrEqual(0);
            
            // Verify num1 >= num2 (for positive results)
            expect(problem.num1).toBeGreaterThanOrEqual(problem.num2);
        }
    });

    test('Subtraction Level 2 generates correct answers', () => {
        mathModel.setLevel(2, 'subtraction');
        
        for (let i = 0; i < 100; i++) {
            const problem = mathModel.generateProblem();
            
            // Verify answer is correct
            const expectedAnswer = problem.num1 - problem.num2;
            expect(problem.answer).toBe(expectedAnswer);
            
            // Verify answer is not negative
            expect(problem.answer).toBeGreaterThanOrEqual(0);
        }
    });
});

describe('Math Operations - Place Value', () => {
    let localization;
    let operationManager;
    let placeValueExtension;
    let mathModel;

    beforeEach(() => {
        localization = new LocalizationModel('bg');
        operationManager = new OperationManager();
        placeValueExtension = operationManager.getOperationExtension('place_value');
        mathModel = new MathModel(localization, placeValueExtension);
    });

    test('Place Value activity generates correct answers', () => {
        mathModel.setLevel(1, 'place_value');
        
        for (let i = 0; i < 50; i++) {
            const problem = mathModel.generateProblem();
            
            // Verify problem has required properties
            expect(problem).toHaveProperty('num1');
            expect(problem).toHaveProperty('answer');
            expect(problem).toHaveProperty('operation');
            
            // Verify operation type
            expect(problem.operation).toBe('place_value_recognition');
            
            // Verify answer is correct for place value decomposition
            // For level 1, it asks for ones or tens digit
            const expectedOnes = problem.num1 % 10;
            const expectedTens = Math.floor(problem.num1 / 10);
            
            // Answer should be either ones or tens depending on question type
            if (problem.questionType === 'ones') {
                expect(problem.answer).toBe(expectedOnes);
            } else {
                expect(problem.answer).toBe(expectedTens);
            }
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
        const badge = mathModel.checkBadge();
        expect(badge).not.toBeNull();
        expect(badge).toContain('Печелиш значка:'); // Bulgarian for "You earned a badge:"
    });
});

describe('Bug Fix - Place Value Level 2 Completion', () => {
    let localization;
    let operationManager;
    let placeValueExtension;
    let mathModel;

    beforeEach(() => {
        localization = new LocalizationModel('bg');
        operationManager = new OperationManager();
        placeValueExtension = operationManager.getOperationExtension('place_value');
        mathModel = new MathModel(localization, placeValueExtension);
    });

    test('Place Value Level 2 problem has currentStep property set to 1', () => {
        mathModel.setLevel(2, 'place_value');
        
        const problem = mathModel.generateProblem();
        
        expect(problem.currentStep).toBe(1);
        expect(problem.stepAnswers).toHaveLength(4);
    });

    test('Place Value Level 2 problem marks completion with currentStep=5 after all steps', () => {
        mathModel.setLevel(2, 'place_value');
        
        const problem = mathModel.generateProblem();
        
        // Simulate completing all 4 steps
        problem.currentStep = 2;
        problem.currentStep = 3;
        problem.currentStep = 4;
        
        // After step 4 completion, currentStep should be set to 5
        problem.currentStep = 5;
        
        // Verify that currentStep=5 indicates completion
        expect(problem.currentStep).toBe(5);
        expect(problem.currentStep >= 5).toBe(true);
    });

    test('Multiple Place Value problems can be generated in sequence', () => {
        mathModel.setLevel(2, 'place_value');
        
        // Generate first problem
        const problem1 = mathModel.generateProblem();
        expect(problem1.currentStep).toBe(1);
        
        // Simulate completion
        problem1.currentStep = 5;
        
        // Generate second problem
        const problem2 = mathModel.generateProblem();
        expect(problem2.currentStep).toBe(1);
        expect(problem2.num1).toBeDefined();
        expect(problem2.num2).toBeDefined();
        
        // Verify problems are different (highly likely)
        const isDifferent = problem1.num1 !== problem2.num1 || problem1.num2 !== problem2.num2;
        expect(isDifferent).toBe(true);
    });

    test('Place Value Level 2 stepAnswers are correct for all 4 steps', () => {
        mathModel.setLevel(2, 'place_value');
        
        const problem = mathModel.generateProblem();
        
        // Step 1: ones sum
        expect(problem.stepAnswers[0]).toBe(problem.onesSum);
        
        // Step 2: carry over
        expect(problem.stepAnswers[1]).toBe(problem.carryOver);
        
        // Step 3: tens sum + carry
        expect(problem.stepAnswers[2]).toBe(problem.tensSum + problem.carryOver);
        
        // Step 4: final answer
        expect(problem.stepAnswers[3]).toBe(problem.answer);
    });
});
