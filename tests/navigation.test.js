/**
 * Test suite for Navigation
 * Tests that navigation works correctly with both keyboard and mouse
 */

// Mock controller for testing navigation
class MockController {
    constructor() {
        this.localization = new LocalizationModel('bg');
        this.subjectManager = new SubjectManager();
        this.activityManager = null;
        this.model = null;
        this.currentSubject = null;
        this.currentActivity = null;
        this.currentLevel = null;
        this.navigationStack = [];
    }
    
    selectSubject(subjectName) {
        this.currentSubject = subjectName;
        this.currentActivity = null;
        this.currentLevel = null;
        // Bug fix: start with empty stack when selecting subject
        this.navigationStack = [];
        this.activityManager = this.subjectManager.getActivityManager(subjectName);
    }
    
    initializeOperationSelection() {
        // Bug fix: push 'subject' when showing operations screen
        const topOfStack = this.navigationStack.length > 0 
            ? this.navigationStack[this.navigationStack.length - 1] 
            : null;
        if (topOfStack !== 'subject') {
            this.navigationStack.push('subject');
        }
    }
    
    selectOperation(operationName) {
        this.currentActivity = operationName;
        
        // Only push 'activity' if it's not already on the stack
        const topOfStack = this.navigationStack.length > 0 
            ? this.navigationStack[this.navigationStack.length - 1] 
            : null;
        if (topOfStack !== 'activity') {
            this.navigationStack.push('activity');
        }
        
        const operationExtension = this.activityManager.getOperationExtension(operationName);
        
        if (this.currentSubject === 'math') {
            this.model = new MathModel(this.localization, operationExtension);
        } else if (this.currentSubject === 'bulgarian') {
            this.model = new BulgarianLanguageModel(this.localization, operationExtension);
        }
        
        // Check if activity has multiple levels or just one
        const levels = this.model.getLocalizedLevels();
        const levelCount = Object.keys(levels).length;
        
        if (levelCount === 1) {
            // Single level - go directly to practice
            const singleLevel = parseInt(Object.keys(levels)[0]);
            this.startLevel(singleLevel, 'current');
        } else {
            // Multiple levels - show level selection
            this.initializeLevelSelection();
        }
    }
    
    initializeLevelSelection() {
        // Only push 'level_select' if it's not already on the stack
        const topOfStack = this.navigationStack.length > 0 
            ? this.navigationStack[this.navigationStack.length - 1] 
            : null;
        if (topOfStack !== 'level_select') {
            this.navigationStack.push('level_select');
        }
    }
    
    startLevel(level, operation) {
        this.currentLevel = level;
        
        // Only push 'game' if it's not already on the stack
        const topOfStack = this.navigationStack.length > 0 
            ? this.navigationStack[this.navigationStack.length - 1] 
            : null;
        if (topOfStack !== 'game') {
            this.navigationStack.push('game');
        }
        
        this.model.setLevel(level, operation);
    }
    
    navigateBack() {
        // Pop current state
        if (this.navigationStack.length > 0) {
            this.navigationStack.pop();
        }
        
        // Get previous state
        const previousState = this.navigationStack.length > 0 
            ? this.navigationStack[this.navigationStack.length - 1] 
            : null;
        
        return previousState;
    }
}

describe('Navigation - Math Subject', () => {
    let controller;

    beforeEach(() => {
        controller = new MockController();
    });

    test('Navigation stack starts empty after selecting Math subject', () => {
        controller.selectSubject('math');
        
        // Bug fix: stack should be empty when on subject screen
        expect(controller.navigationStack).toEqual([]);
        expect(controller.currentSubject).toBe('math');
    });

    test('Navigation stack after showing operations screen', () => {
        controller.selectSubject('math');
        controller.initializeOperationSelection();
        
        // Bug fix: 'subject' pushed when showing operations
        expect(controller.navigationStack).toEqual(['subject']);
    });

    test('Navigation stack after selecting Addition operation (multi-level)', () => {
        controller.selectSubject('math');
        controller.initializeOperationSelection();
        controller.selectOperation('addition');
        
        expect(controller.navigationStack).toEqual(['subject', 'activity', 'level_select']);
        expect(controller.currentActivity).toBe('addition');
    });

    test('Navigation stack after starting Level 1 Addition', () => {
        controller.selectSubject('math');
        controller.initializeOperationSelection();
        controller.selectOperation('addition');
        controller.startLevel(1, 'addition');
        
        expect(controller.navigationStack).toEqual(['subject', 'activity', 'level_select', 'game']);
        expect(controller.currentLevel).toBe(1);
    });

    test('Navigate back from game goes to level selection', () => {
        controller.selectSubject('math');
        controller.initializeOperationSelection();
        controller.selectOperation('addition');
        controller.startLevel(1, 'addition');
        
        const previousState = controller.navigateBack();
        
        expect(previousState).toBe('level_select');
        expect(controller.navigationStack).toEqual(['subject', 'activity', 'level_select']);
    });

    test('Navigate back from level selection goes to activity selection', () => {
        controller.selectSubject('math');
        controller.initializeOperationSelection();
        controller.selectOperation('addition');
        
        const previousState = controller.navigateBack();
        
        expect(previousState).toBe('activity');
        expect(controller.navigationStack).toEqual(['subject', 'activity']);
    });

    test('Navigate back from activity selection goes to subject selection', () => {
        controller.selectSubject('math');
        controller.initializeOperationSelection();
        controller.selectOperation('addition');
        controller.navigateBack(); // Back to activity
        
        const previousState = controller.navigateBack();
        
        expect(previousState).toBe('subject');
        expect(controller.navigationStack).toEqual(['subject']);
    });
    
    test('Bug fix: Can navigate back to subject list (empty stack)', () => {
        controller.selectSubject('math');
        controller.initializeOperationSelection();
        controller.selectOperation('addition');
        controller.navigateBack(); // Back to activity
        controller.navigateBack(); // Back to subject
        
        // Navigate back from subject - should reach empty stack
        const previousState = controller.navigateBack();
        
        expect(previousState).toBeNull();
        expect(controller.navigationStack).toEqual([]);
    });
});

describe('Navigation - Single-Level Activities', () => {
    let controller;

    beforeEach(() => {
        controller = new MockController();
    });

    test('Place Value (multi-level) shows level selection', () => {
        controller.selectSubject('math');
        controller.initializeOperationSelection();
        controller.selectOperation('place_value');
        
        // Should show level selection (Place Value has 2 levels)
        expect(controller.navigationStack).toEqual(['subject', 'activity', 'level_select']);
        expect(controller.currentLevel).toBeNull(); // No level selected yet
    });

    test('Navigate back from multi-level activity after selecting level', () => {
        controller.selectSubject('math');
        controller.initializeOperationSelection();
        controller.selectOperation('place_value');
        controller.startLevel(1, 'place_value');
        
        const previousState = controller.navigateBack();
        
        // Should go back to level selection
        expect(previousState).toBe('level_select');
        expect(controller.navigationStack).toEqual(['subject', 'activity', 'level_select']);
    });
});

describe('Navigation - Bulgarian Subject', () => {
    let controller;

    beforeEach(() => {
        controller = new MockController();
    });

    test('Navigation stack starts empty after selecting Bulgarian subject', () => {
        controller.selectSubject('bulgarian');
        
        // Bug fix: stack should be empty when on subject screen
        expect(controller.navigationStack).toEqual([]);
        expect(controller.currentSubject).toBe('bulgarian');
    });

    test('Navigation stack after selecting Letters activity', () => {
        controller.selectSubject('bulgarian');
        controller.initializeOperationSelection();
        controller.selectOperation('letters');
        
        expect(controller.navigationStack).toEqual(['subject', 'activity', 'level_select']);
        expect(controller.currentActivity).toBe('letters');
    });

    test('Navigate back from Bulgarian game goes to level selection', () => {
        controller.selectSubject('bulgarian');
        controller.initializeOperationSelection();
        controller.selectOperation('letters');
        controller.startLevel(1, 'letters');
        
        const previousState = controller.navigateBack();
        
        expect(previousState).toBe('level_select');
        expect(controller.navigationStack).toEqual(['subject', 'activity', 'level_select']);
    });
});

describe('Navigation - State Preservation After Back Navigation', () => {
    let controller;

    beforeEach(() => {
        controller = new MockController();
    });

    test('Can navigate to same subject/activity after going back', () => {
        // First navigation
        controller.selectSubject('math');
        controller.initializeOperationSelection();
        controller.selectOperation('addition');
        controller.startLevel(1, 'addition');
        
        // Navigate back to subject
        controller.navigateBack(); // to level_select
        controller.navigateBack(); // to activity
        controller.navigateBack(); // to subject
        
        // Navigate again to same activity
        controller.initializeOperationSelection();
        controller.selectOperation('addition');
        controller.startLevel(2, 'addition');
        
        expect(controller.currentLevel).toBe(2);
        expect(controller.model).not.toBeNull();
        
        // Verify model can generate problems
        const problem = controller.model.generateProblem();
        expect(problem).toHaveProperty('answer');
    });

    test('Can navigate to different subject/activity after going back', () => {
        // First navigation - Math
        controller.selectSubject('math');
        controller.initializeOperationSelection();
        controller.selectOperation('addition');
        controller.startLevel(1, 'addition');
        
        // Navigate back to subject
        controller.navigateBack(); // to level_select
        controller.navigateBack(); // to activity
        controller.navigateBack(); // to subject
        controller.navigateBack(); // to empty stack
        
        // Navigate to different subject - Bulgarian
        controller.selectSubject('bulgarian');
        controller.initializeOperationSelection();
        controller.selectOperation('letters');
        controller.startLevel(1, 'letters');
        
        expect(controller.currentSubject).toBe('bulgarian');
        expect(controller.currentActivity).toBe('letters');
        expect(controller.model).not.toBeNull();
        
        // Verify model can generate problems
        const problem = controller.model.generateProblem();
        expect(problem).toHaveProperty('display'); // Bulgarian uses 'display' property
    });

    test('Model generates correct results after back navigation', () => {
        // Navigate to Math Addition
        controller.selectSubject('math');
        controller.initializeOperationSelection();
        controller.selectOperation('addition');
        controller.startLevel(1, 'addition');
        
        // Generate a problem and verify
        let problem = controller.model.generateProblem();
        let expectedAnswer = problem.num1 + problem.num2;
        expect(problem.answer).toBe(expectedAnswer);
        
        // Navigate back and forth
        controller.navigateBack(); // to level_select
        controller.startLevel(2, 'addition');
        
        // Generate another problem and verify
        problem = controller.model.generateProblem();
        expectedAnswer = problem.num1 + problem.num2;
        expect(problem.answer).toBe(expectedAnswer);
    });
});

describe('Navigation - Backspace Bug Fix', () => {
    let controller;

    beforeEach(() => {
        controller = new MockController();
    });

    test('Bug fix: Backspace navigates step by step, allowing return to subject list', () => {
        // Navigate through all screens
        controller.selectSubject('math');
        expect(controller.navigationStack).toEqual([]);
        
        controller.initializeOperationSelection();
        expect(controller.navigationStack).toEqual(['subject']);
        
        controller.selectOperation('addition');
        expect(controller.navigationStack).toEqual(['subject', 'activity', 'level_select']);
        
        controller.startLevel(1, 'addition');
        expect(controller.navigationStack).toEqual(['subject', 'activity', 'level_select', 'game']);
        
        // Press backspace from game - should go to level_select
        let previousState = controller.navigateBack();
        expect(previousState).toBe('level_select');
        expect(controller.navigationStack).toEqual(['subject', 'activity', 'level_select']);
        
        // Press backspace from level_select - should go to activity
        previousState = controller.navigateBack();
        expect(previousState).toBe('activity');
        expect(controller.navigationStack).toEqual(['subject', 'activity']);
        
        // Press backspace from activity - should go to subject
        previousState = controller.navigateBack();
        expect(previousState).toBe('subject');
        expect(controller.navigationStack).toEqual(['subject']);
        
        // Press backspace from subject - should reach subject list (empty stack)
        previousState = controller.navigateBack();
        expect(previousState).toBeNull();
        expect(controller.navigationStack).toEqual([]);
    });

    test('Bug fix: Backspace preserves navigation state in Bulgarian activities', () => {
        // Navigate through Bulgarian activity
        controller.selectSubject('bulgarian');
        expect(controller.navigationStack).toEqual([]);
        
        controller.initializeOperationSelection();
        expect(controller.navigationStack).toEqual(['subject']);
        
        controller.selectOperation('letters');
        expect(controller.navigationStack).toEqual(['subject', 'activity', 'level_select']);
        
        controller.startLevel(1, 'letters');
        expect(controller.navigationStack).toEqual(['subject', 'activity', 'level_select', 'game']);
        
        // Navigate back step by step
        controller.navigateBack(); // to level_select
        expect(controller.navigationStack).toEqual(['subject', 'activity', 'level_select']);
        
        controller.navigateBack(); // to activity
        expect(controller.navigationStack).toEqual(['subject', 'activity']);
        
        controller.navigateBack(); // to subject
        expect(controller.navigationStack).toEqual(['subject']);
        
        // Navigate back to subject list
        controller.navigateBack();
        expect(controller.navigationStack).toEqual([]);
    });

    test('Bug fix: Navigation stack remains consistent after multiple back-and-forth navigations', () => {
        // First journey
        controller.selectSubject('math');
        controller.initializeOperationSelection();
        controller.selectOperation('addition');
        controller.startLevel(1, 'addition');
        expect(controller.navigationStack).toEqual(['subject', 'activity', 'level_select', 'game']);
        
        // Go back two steps
        controller.navigateBack(); // to level_select
        controller.navigateBack(); // to activity
        expect(controller.navigationStack).toEqual(['subject', 'activity']);
        
        // Go forward again
        controller.selectOperation('subtraction');
        controller.startLevel(2, 'subtraction');
        expect(controller.navigationStack).toEqual(['subject', 'activity', 'level_select', 'game']);
        
        // Go back three steps
        controller.navigateBack(); // to level_select
        expect(controller.navigationStack).toEqual(['subject', 'activity', 'level_select']);
        controller.navigateBack(); // to activity
        expect(controller.navigationStack).toEqual(['subject', 'activity']);
        controller.navigateBack(); // to subject
        expect(controller.navigationStack).toEqual(['subject']);
        
        // Can reach subject list
        controller.navigateBack();
        expect(controller.navigationStack).toEqual([]);
    });
});
