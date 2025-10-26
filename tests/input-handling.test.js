/**
 * Test suite for Input Handling Bug Fixes
 * Tests that input works correctly across different activities and levels
 * Addresses Bug #3: Input conflicts when switching between activities
 */

describe('Bug Fix - Input Handling Across Activities', () => {
    let localization;
    let operationManager;

    beforeEach(() => {
        localization = new LocalizationModel('bg');
        operationManager = new OperationManager();
    });

    test('Addition Level 1 generates valid problems with numeric answers', () => {
        const additionExtension = operationManager.getOperationExtension('addition');
        const mathModel = new MathModel(localization, additionExtension);
        mathModel.setLevel(1, 'addition');
        
        for (let i = 0; i < 10; i++) {
            const problem = mathModel.generateProblem();
            
            // Verify problem structure
            expect(problem).toHaveProperty('num1');
            expect(problem).toHaveProperty('num2');
            expect(problem).toHaveProperty('answer');
            expect(problem.operation).toBe('+');
            
            // Verify answer is a number
            expect(typeof problem.answer).toBe('number');
            expect(problem.answer).toBe(problem.num1 + problem.num2);
        }
    });

    test('Subtraction Level 1 generates valid problems with numeric answers', () => {
        const subtractionExtension = operationManager.getOperationExtension('subtraction');
        const mathModel = new MathModel(localization, subtractionExtension);
        mathModel.setLevel(1, 'subtraction');
        
        for (let i = 0; i < 10; i++) {
            const problem = mathModel.generateProblem();
            
            // Verify problem structure
            expect(problem).toHaveProperty('num1');
            expect(problem).toHaveProperty('num2');
            expect(problem).toHaveProperty('answer');
            expect(problem.operation).toBe('-');
            
            // Verify answer is a number
            expect(typeof problem.answer).toBe('number');
            expect(problem.answer).toBe(problem.num1 - problem.num2);
        }
    });

    test('Place Value Level 1 generates valid problems with numeric answers', () => {
        const placeValueExtension = operationManager.getOperationExtension('place_value');
        const mathModel = new MathModel(localization, placeValueExtension);
        mathModel.setLevel(1, 'place_value');
        
        for (let i = 0; i < 10; i++) {
            const problem = mathModel.generateProblem();
            
            // Verify problem structure
            expect(problem).toHaveProperty('num1');
            expect(problem).toHaveProperty('answer');
            expect(problem.operation).toBe('place_value_recognition');
            
            // Verify answer is a number (0-9 for ones or tens digit)
            expect(typeof problem.answer).toBe('number');
            expect(problem.answer).toBeGreaterThanOrEqual(0);
            expect(problem.answer).toBeLessThanOrEqual(9);
        }
    });

    test('Place Value Level 2 generates valid multi-step problems', () => {
        const placeValueExtension = operationManager.getOperationExtension('place_value');
        const mathModel = new MathModel(localization, placeValueExtension);
        mathModel.setLevel(2, 'place_value');
        
        for (let i = 0; i < 10; i++) {
            const problem = mathModel.generateProblem();
            
            // Verify problem structure
            expect(problem).toHaveProperty('num1');
            expect(problem).toHaveProperty('num2');
            expect(problem).toHaveProperty('answer');
            expect(problem.operation).toBe('place_value_calculation');
            expect(problem).toHaveProperty('stepAnswers');
            expect(problem).toHaveProperty('currentStep');
            
            // Verify all step answers are numbers
            expect(problem.stepAnswers.length).toBe(4);
            problem.stepAnswers.forEach(stepAnswer => {
                expect(typeof stepAnswer).toBe('number');
            });
            
            // Verify current step starts at 1
            expect(problem.currentStep).toBe(1);
        }
    });

    test('Bug fix: Switching from Addition to Subtraction maintains correct problem generation', () => {
        // Start with Addition Level 1
        let extension = operationManager.getOperationExtension('addition');
        let mathModel = new MathModel(localization, extension);
        mathModel.setLevel(1, 'addition');
        
        const additionProblem = mathModel.generateProblem();
        expect(additionProblem.operation).toBe('+');
        expect(additionProblem.answer).toBe(additionProblem.num1 + additionProblem.num2);
        
        // Switch to Subtraction Level 1 (simulate new activity)
        extension = operationManager.getOperationExtension('subtraction');
        mathModel = new MathModel(localization, extension);
        mathModel.setLevel(1, 'subtraction');
        
        const subtractionProblem = mathModel.generateProblem();
        expect(subtractionProblem.operation).toBe('-');
        expect(subtractionProblem.answer).toBe(subtractionProblem.num1 - subtractionProblem.num2);
        
        // Verify problems are different types
        expect(additionProblem.operation).not.toBe(subtractionProblem.operation);
    });

    test('Bug fix: Switching from Addition to Place Value maintains correct problem generation', () => {
        // Start with Addition Level 2
        let extension = operationManager.getOperationExtension('addition');
        let mathModel = new MathModel(localization, extension);
        mathModel.setLevel(2, 'addition');
        
        const additionProblem = mathModel.generateProblem();
        expect(additionProblem.operation).toBe('+');
        
        // Switch to Place Value Level 2 (simulate new activity)
        extension = operationManager.getOperationExtension('place_value');
        mathModel = new MathModel(localization, extension);
        mathModel.setLevel(2, 'place_value');
        
        const placeValueProblem = mathModel.generateProblem();
        expect(placeValueProblem.operation).toBe('place_value_calculation');
        expect(placeValueProblem).toHaveProperty('stepAnswers');
        expect(placeValueProblem.stepAnswers.length).toBe(4);
        
        // Verify problems are different types
        expect(additionProblem.operation).not.toBe(placeValueProblem.operation);
    });

    test('Bug fix: Multiple activity switches maintain correct answer validation', () => {
        // Addition
        let extension = operationManager.getOperationExtension('addition');
        let mathModel = new MathModel(localization, extension);
        mathModel.setLevel(1, 'addition');
        let problem = mathModel.generateProblem();
        expect(mathModel.checkAnswer(problem.answer.toString())).toBe(true);
        expect(mathModel.checkAnswer((problem.answer + 1).toString())).toBe(false);
        
        // Switch to Subtraction
        extension = operationManager.getOperationExtension('subtraction');
        mathModel = new MathModel(localization, extension);
        mathModel.setLevel(1, 'subtraction');
        problem = mathModel.generateProblem();
        expect(mathModel.checkAnswer(problem.answer.toString())).toBe(true);
        expect(mathModel.checkAnswer((problem.answer + 1).toString())).toBe(false);
        
        // Switch to Place Value
        extension = operationManager.getOperationExtension('place_value');
        mathModel = new MathModel(localization, extension);
        mathModel.setLevel(1, 'place_value');
        problem = mathModel.generateProblem();
        expect(mathModel.checkAnswer(problem.answer.toString())).toBe(true);
        expect(mathModel.checkAnswer((problem.answer + 1).toString())).toBe(false);
        
        // Switch back to Addition
        extension = operationManager.getOperationExtension('addition');
        mathModel = new MathModel(localization, extension);
        mathModel.setLevel(2, 'addition');
        problem = mathModel.generateProblem();
        expect(mathModel.checkAnswer(problem.answer.toString())).toBe(true);
        expect(mathModel.checkAnswer((problem.answer + 1).toString())).toBe(false);
    });
});

describe('Bug Fix - Bulgarian Language Input Handling', () => {
    let localization;
    let bulgarianActivityManager;

    beforeEach(() => {
        localization = new LocalizationModel('bg');
        const subjectManager = new SubjectManager();
        bulgarianActivityManager = subjectManager.getActivityManager('bulgarian');
    });

    test('Letters activity generates valid problems', () => {
        const lettersExtension = bulgarianActivityManager.getOperationExtension('letters');
        const bulgarianModel = new BulgarianLanguageModel(localization, lettersExtension);
        bulgarianModel.setLevel(1, 'letters');
        
        for (let i = 0; i < 10; i++) {
            const problem = bulgarianModel.generateProblem();
            
            // Verify problem structure
            expect(problem).toHaveProperty('display');
            expect(problem).toHaveProperty('answer');
            expect(problem.operation).toBe('read');
            
            // Verify answer is a string (letter)
            expect(typeof problem.answer).toBe('string');
            expect(problem.answer.length).toBeGreaterThan(0);
        }
    });

    test('Bug fix: Switching from Math to Bulgarian maintains correct problem generation', () => {
        // Start with Math Addition
        const operationManager = new OperationManager();
        const additionExtension = operationManager.getOperationExtension('addition');
        let model = new MathModel(localization, additionExtension);
        model.setLevel(1, 'addition');
        
        const mathProblem = model.generateProblem();
        expect(mathProblem.operation).toBe('+');
        expect(typeof mathProblem.answer).toBe('number');
        
        // Switch to Bulgarian Letters (simulate new subject/activity)
        const lettersExtension = bulgarianActivityManager.getOperationExtension('letters');
        model = new BulgarianLanguageModel(localization, lettersExtension);
        model.setLevel(1, 'letters');
        
        const bulgarianProblem = model.generateProblem();
        expect(bulgarianProblem.operation).toBe('read');
        expect(typeof bulgarianProblem.answer).toBe('string');
        
        // Verify problems are different types
        expect(mathProblem.operation).not.toBe(bulgarianProblem.operation);
        expect(typeof mathProblem.answer).not.toBe(typeof bulgarianProblem.answer);
    });

    test('Bug fix: Switching from Bulgarian to Math maintains correct problem generation', () => {
        // Start with Bulgarian Letters
        const lettersExtension = bulgarianActivityManager.getOperationExtension('letters');
        let model = new BulgarianLanguageModel(localization, lettersExtension);
        model.setLevel(1, 'letters');
        
        const bulgarianProblem = model.generateProblem();
        expect(bulgarianProblem.operation).toBe('read');
        expect(typeof bulgarianProblem.answer).toBe('string');
        
        // Switch to Math Addition (simulate new subject/activity)
        const operationManager = new OperationManager();
        const additionExtension = operationManager.getOperationExtension('addition');
        model = new MathModel(localization, additionExtension);
        model.setLevel(1, 'addition');
        
        const mathProblem = model.generateProblem();
        expect(mathProblem.operation).toBe('+');
        expect(typeof mathProblem.answer).toBe('number');
        
        // Verify problems are different types
        expect(bulgarianProblem.operation).not.toBe(mathProblem.operation);
        expect(typeof bulgarianProblem.answer).not.toBe(typeof mathProblem.answer);
    });
});
