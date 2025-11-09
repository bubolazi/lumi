/**
 * Test suite for Login Input Bug Fix
 * Tests that login input works correctly with numeric keys and backspace
 * Addresses the bug where keyboard event handlers interfered with login text entry
 */

const fs = require('fs');
const path = require('path');

// Load AppView and AppController classes
const appViewCode = fs.readFileSync(path.join(__dirname, '../js/views/AppView.js'), 'utf8');
const appControllerCode = fs.readFileSync(path.join(__dirname, '../js/controllers/AppController.js'), 'utf8');

// Use Function constructor to load classes into global scope
new Function(appViewCode + '\nglobalThis.AppView = AppView;')();
new Function(appControllerCode + '\nglobalThis.AppController = AppController;')();

describe('Bug Fix - Login Input Handling', () => {
    let view;
    let localization;
    let loginInput;
    let loginModal;

    beforeEach(() => {
        document.body.innerHTML = `
            <div id="login-modal" style="display: none;">
                <div class="login-content">
                    <div class="login-prompt">ВЪВЕДИ ТВОЕТО ИМЕ:</div>
                    <div class="login-input-line">
                        <span class="input-prompt">></span>
                        <input type="text" id="login-input" autocomplete="off" maxlength="30">
                        <span class="login-cursor"></span>
                    </div>
                    <div class="login-instructions">НАТИСНИ ENTER ЗА ВХОД • ESC ЗА ОТКАЗ</div>
                </div>
            </div>
            <div id="breadcrumb-nav"></div>
            <div id="user-info"></div>
            <div id="user-display"></div>
            <button id="logout-button"></button>
            <div id="subject-select" class="screen"></div>
            <div id="operation-select" class="screen"></div>
            <div id="level-select" class="screen"></div>
            <div id="game-screen" class="screen"></div>
            <div id="problem-display"></div>
            <div id="problem-display-compact"></div>
            <div id="calculation-container"></div>
            <div id="calculation-history"></div>
            <div id="standard-display"></div>
            <input type="text" id="terminal-input">
            <div id="score-display"></div>
            <div id="problems-display"></div>
            <div id="terminal-message"></div>
            <ul class="subject-list"></ul>
            <ul class="operation-list"></ul>
            <ul class="level-list"></ul>
        `;

        localization = new LocalizationModel('bg');
        view = new AppView(localization);
        loginInput = document.getElementById('login-input');
        loginModal = document.getElementById('login-modal');
    });

    afterEach(() => {
        document.body.innerHTML = '';
    });

    test('Login input should accept numeric characters', (done) => {
        view.promptUserLogin((username) => {
            expect(username).toBe('123');
            done();
        });

        loginInput.value = '123';
        const enterEvent = new KeyboardEvent('keydown', { key: 'Enter' });
        loginInput.dispatchEvent(enterEvent);
    });

    test('Login input should accept alphanumeric usernames', (done) => {
        view.promptUserLogin((username) => {
            expect(username).toBe('Ivan123');
            done();
        });

        loginInput.value = 'Ivan123';
        const enterEvent = new KeyboardEvent('keydown', { key: 'Enter' });
        loginInput.dispatchEvent(enterEvent);
    });

    test('Login input should allow typing without interference from keyboard handlers', () => {
        let subjectSelectionTriggered = false;
        
        view.bindSubjectKeyboardSelection(() => {
            subjectSelectionTriggered = true;
        });
        
        view.promptUserLogin(() => {});

        const keyEvent = new KeyboardEvent('keydown', { 
            key: '1',
            bubbles: true,
            cancelable: true 
        });
        
        loginInput.dispatchEvent(keyEvent);

        expect(subjectSelectionTriggered).toBe(false);
        expect(view._subjectKeyHandler).toBeNull();
    });

    test('Escape key should close login modal', () => {
        view.promptUserLogin(() => {});
        
        expect(loginModal.style.display).toBe('flex');
        
        const escEvent = new KeyboardEvent('keydown', { key: 'Escape' });
        loginInput.dispatchEvent(escEvent);
        
        expect(loginModal.style.display).toBe('none');
    });

    test('Empty username should not trigger callback', () => {
        let callbackCalled = false;
        
        view.promptUserLogin(() => {
            callbackCalled = true;
        });

        loginInput.value = '';
        const enterEvent = new KeyboardEvent('keydown', { key: 'Enter' });
        loginInput.dispatchEvent(enterEvent);

        expect(callbackCalled).toBe(false);
        expect(loginModal.style.display).toBe('flex');
    });

    test('Whitespace-only username should not trigger callback', () => {
        let callbackCalled = false;
        
        view.promptUserLogin(() => {
            callbackCalled = true;
        });

        loginInput.value = '   ';
        const enterEvent = new KeyboardEvent('keydown', { key: 'Enter' });
        loginInput.dispatchEvent(enterEvent);

        expect(callbackCalled).toBe(false);
        expect(loginModal.style.display).toBe('flex');
    });

    test('Login modal should clear input on close', (done) => {
        view.promptUserLogin((username) => {
            expect(loginInput.value).toBe('');
            done();
        });

        loginInput.value = 'TestUser';
        const enterEvent = new KeyboardEvent('keydown', { key: 'Enter' });
        loginInput.dispatchEvent(enterEvent);
    });

    test('Keyboard selection handlers should be unbound when login modal opens', () => {
        view.bindSubjectKeyboardSelection(() => {});
        
        expect(view._subjectKeyHandler).toBeDefined();
        
        view.promptUserLogin(() => {});
        
        expect(view._subjectKeyHandler).toBeNull();
    });
});

describe('Bug Fix - Global Navigation Handler During Login', () => {
    let controller;
    let localization;
    let subjectManager;
    let userStorage;
    let loginModal;

    beforeEach(() => {
        document.body.innerHTML = `
            <div id="login-modal" style="display: none;">
                <input type="text" id="login-input">
            </div>
            <div id="breadcrumb-nav"></div>
            <div id="user-info"></div>
            <div id="user-display"></div>
            <button id="logout-button"></button>
            <div id="subject-select" class="screen"></div>
            <div id="operation-select" class="screen"></div>
            <div id="level-select" class="screen"></div>
            <div id="game-screen" class="screen"></div>
            <div id="problem-display"></div>
            <div id="problem-display-compact"></div>
            <div id="calculation-container"></div>
            <div id="calculation-history"></div>
            <div id="standard-display"></div>
            <input type="text" id="terminal-input">
            <div id="score-display"></div>
            <div id="problems-display"></div>
            <div id="terminal-message"></div>
            <ul class="subject-list"></ul>
            <ul class="operation-list"></ul>
            <ul class="level-list"></ul>
        `;

        localization = new LocalizationModel('bg');
        subjectManager = new SubjectManager();
        userStorage = new UserStorageModel();
        controller = new AppController(localization, subjectManager, userStorage);
        loginModal = document.getElementById('login-modal');
    });

    afterEach(() => {
        document.body.innerHTML = '';
    });

    test('Global navigation handler should not interfere when login modal is visible', () => {
        loginModal.style.display = 'flex';
        
        let navigationOccurred = false;
        const originalNavigateBack = controller.navigateBack;
        controller.navigateBack = () => {
            navigationOccurred = true;
        };

        const backspaceEvent = new KeyboardEvent('keydown', { 
            key: 'Backspace',
            bubbles: true,
            cancelable: true 
        });
        document.dispatchEvent(backspaceEvent);

        expect(navigationOccurred).toBe(false);
        
        controller.navigateBack = originalNavigateBack;
    });

    test('Global navigation handler should work when login modal is hidden', () => {
        loginModal.style.display = 'none';
        
        controller.currentSubject = 'math';
        controller.currentActivity = 'addition';
        controller.navigationStack = ['subject', 'activity'];
        
        const subjectSelect = document.getElementById('subject-select');
        subjectSelect.classList.add('active');

        let navigationOccurred = false;
        const originalNavigateBack = controller.navigateBack;
        controller.navigateBack = () => {
            navigationOccurred = true;
        };

        const backspaceEvent = new KeyboardEvent('keydown', { 
            key: 'Backspace',
            bubbles: true,
            cancelable: true 
        });
        document.dispatchEvent(backspaceEvent);

        expect(navigationOccurred).toBe(true);
        
        controller.navigateBack = originalNavigateBack;
    });
});
