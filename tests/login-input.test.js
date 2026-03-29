/**
 * Test suite for Navigation Handler Behavior
 * Tests that keyboard navigation (backspace) works correctly on selection screens
 */

const fs = require('fs');
const path = require('path');

const appViewCode = fs.readFileSync(path.join(__dirname, '../js/views/AppView.js'), 'utf8');
const appControllerCode = fs.readFileSync(path.join(__dirname, '../js/controllers/AppController.js'), 'utf8');

new Function(appViewCode + '\nglobalThis.AppView = AppView;')();
new Function(appControllerCode + '\nglobalThis.AppController = AppController;')();

describe('Global Navigation Handler - Backspace Behavior', () => {
    let controller;
    let localization;
    let subjectManager;
    let userStorage;

    beforeEach(() => {
        document.body.innerHTML = `
            <div id="breadcrumb-nav"></div>
            <div id="user-info"></div>
            <div id="user-display"></div>
            <button id="logout-button"></button>
            <div id="subject-select" class="screen active"></div>
            <div id="operation-select" class="screen"></div>
            <div id="level-select" class="screen"></div>
            <div id="game-screen" class="screen"></div>
            <div id="problem-display"></div>
            <div id="problem-display-compact"></div>
            <div id="calculation-container"></div>
            <div id="calculation-history"></div>
            <div id="standard-display"></div>
            <input type="number" id="terminal-input">
            <div id="score-display"></div>
            <div id="problems-display"></div>
            <div id="terminal-message"></div>
            <div id="feedback-modal">
                <div id="feedback-header"></div>
                <span id="feedback-emoji"></span>
                <div id="feedback-badge"></div>
                <div id="feedback-footer"></div>
            </div>
            <ul class="subject-list"></ul>
            <ul class="operation-list"></ul>
            <ul class="level-list"></ul>
        `;

        localization = new LocalizationModel('bg');
        subjectManager = new SubjectManager();
        userStorage = new UserStorageModel();
        // auth0Service not needed for navigation tests — pass null
        controller = new AppController(localization, subjectManager, userStorage, null);
    });

    afterEach(() => {
        document.body.innerHTML = '';
    });

    test('Backspace on subject-select screen triggers navigateBack', () => {
        controller.currentSubject = 'math';
        controller.currentActivity = 'addition';
        controller.navigationStack = ['subject', 'activity'];

        const subjectSelect = document.getElementById('subject-select');
        subjectSelect.classList.add('active');

        let navigationOccurred = false;
        const originalNavigateBack = controller.navigateBack.bind(controller);
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

    test('Backspace on game screen does not trigger navigateBack (game handles it)', () => {
        const subjectSelect = document.getElementById('subject-select');
        subjectSelect.classList.remove('active');
        const gameScreen = document.getElementById('game-screen');
        gameScreen.classList.add('active');

        let navigationOccurred = false;
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
    });
});
