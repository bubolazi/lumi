// View: UI rendering and DOM manipulation
class MathView {
    constructor(localization) {
        this.localization = localization;
        this.elements = {
            subjectSelect: document.getElementById('subject-select'),
            operationSelect: document.getElementById('operation-select'),
            levelSelect: document.getElementById('level-select'),
            gameScreen: document.getElementById('game-screen'),
            currentLevel: document.getElementById('current-level'),
            currentOperation: document.getElementById('current-operation'),
            problemDisplay: document.getElementById('problem-display'),
            terminalInput: document.getElementById('terminal-input'),
            scoreDisplay: document.getElementById('score-display'),
            problemsDisplay: document.getElementById('problems-display'),
            terminalMessage: document.getElementById('terminal-message'),
            subjectList: document.querySelector('.subject-list'),
            operationList: document.querySelector('.operation-list'),
            levelList: document.querySelector('.level-list')
        };
        
        // Track message state
        this.messageTimeout = null;
        this.messageVisible = false;
        
        // Initialize static UI text
        this.initializeStaticText();
    }
    
    // Initialize static text elements with Bulgarian translations
    initializeStaticText() {
        // Update page title
        document.title = this.localization.t('MATH_TERMINAL');
        
        // Update header
        const header = document.querySelector('header h1');
        if (header) header.textContent = this.localization.t('MATH_TERMINAL');
        
        // Update subject selection screen
        const subjectSelectTitle = document.querySelector('#subject-select h2');
        if (subjectSelectTitle) subjectSelectTitle.textContent = this.localization.t('SELECT_SUBJECT');
        
        const subjectInstructions = document.querySelector('#subject-select .instructions');
        if (subjectInstructions) subjectInstructions.textContent = this.localization.t('SUBJECT_INSTRUCTIONS');
        
        // Update operation selection screen
        const operationSelectTitle = document.querySelector('#operation-select h2');
        if (operationSelectTitle) operationSelectTitle.textContent = this.localization.t('SELECT_OPERATION');
        
        // Update level selection screen
        const levelSelectTitle = document.querySelector('#level-select h2');
        if (levelSelectTitle) levelSelectTitle.textContent = this.localization.t('SELECT_DIFFICULTY_LEVEL');
        
        // Update instructions
        const operationInstructions = document.querySelector('#operation-select .instructions');
        if (operationInstructions) operationInstructions.textContent = this.localization.t('OPERATION_INSTRUCTIONS');
        
        const levelInstructions = document.querySelector('#level-select .instructions');
        if (levelInstructions) levelInstructions.textContent = this.localization.t('LEVEL_INSTRUCTIONS');
        
        const gameInstructions = document.querySelector('#game-screen .instructions');
        if (gameInstructions) gameInstructions.textContent = this.localization.t('GAME_INSTRUCTIONS');
        
        // Update HTML lang attribute
        document.documentElement.lang = this.localization.getCurrentLanguage();
    }
    
    // Show a specific screen
    showScreen(screenId) {
        // Hide all screens
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });
        
        // Show selected screen
        document.getElementById(screenId).classList.add('active');
        
        // Focus input if showing game screen
        if (screenId === 'game-screen') {
            this.focusInput();
        }
    }
    
    // Display a problem (math or Bulgarian language)
    displayProblem(problem) {
        if (problem.operation === 'read') {
            // Bulgarian Language activity - just show the letter/syllable/word
            this.elements.problemDisplay.textContent = problem.display;
        } else {
            // Math problem
            this.elements.problemDisplay.textContent = 
                `${problem.num1} ${problem.operation} ${problem.num2} = ?`;
        }
    }
    
    // Update game instructions dynamically
    updateGameInstructions(instructionKey) {
        const gameInstructions = document.querySelector('#game-screen .instructions');
        if (gameInstructions) {
            gameInstructions.textContent = this.localization.t(instructionKey);
        }
    }
    
    // Update the game status display
    updateGameStatus(gameState) {
        this.elements.currentLevel.textContent = `${this.localization.t('LEVEL')} ${gameState.level}`;
        this.elements.currentOperation.textContent = this.localization.t(gameState.operationKey);
        this.elements.scoreDisplay.textContent = `${this.localization.t('SCORE')}: ${gameState.score}`;
        this.elements.problemsDisplay.textContent = `${this.localization.t('PROBLEMS')}: ${gameState.problemsSolved}`;
    }
    
    // Show feedback message
    showMessage(message, autoDismiss = false, duration = 1500) {
        this.elements.terminalMessage.textContent = message;
        this.elements.terminalMessage.classList.add('show');
        this.messageVisible = true;
        
        // Clear any existing timeout
        if (this.messageTimeout) {
            clearTimeout(this.messageTimeout);
            this.messageTimeout = null;
        }
        
        // Only auto-dismiss if explicitly requested (for success messages)
        if (autoDismiss) {
            this.messageTimeout = setTimeout(() => {
                this.hideMessage();
            }, duration);
        }
    }
    
    // Hide feedback message
    hideMessage() {
        this.elements.terminalMessage.classList.remove('show');
        this.messageVisible = false;
        if (this.messageTimeout) {
            clearTimeout(this.messageTimeout);
            this.messageTimeout = null;
        }
    }
    
    // Check if message is visible
    isMessageVisible() {
        return this.messageVisible;
    }
    
    // Clear and focus the input field
    clearAndFocusInput() {
        this.elements.terminalInput.value = '';
        this.focusInput();
    }
    
    // Focus the input field
    focusInput() {
        setTimeout(() => {
            this.elements.terminalInput.focus();
        }, 100);
    }
    
    // Get user input value
    getUserInput() {
        return this.elements.terminalInput.value;
    }
    
    // Bind event listeners (delegated to controller)
    bindSubjectSelection(handler) {
        this.elements.subjectList.addEventListener('click', (e) => {
            if (e.target.classList.contains('subject-item')) {
                const subject = e.target.dataset.subject;
                handler(subject);
            }
        });
    }
    
    bindOperationSelection(handler) {
        this.elements.operationList.addEventListener('click', (e) => {
            if (e.target.classList.contains('operation-item')) {
                const operation = e.target.dataset.operation;
                handler(operation);
            }
        });
    }
    
    bindLevelSelection(handler) {
        this.elements.levelList.addEventListener('click', (e) => {
            if (e.target.classList.contains('level-item')) {
                const level = parseInt(e.target.dataset.level);
                const operation = e.target.dataset.operation;
                handler(level, operation);
            }
        });
    }
    
    // Bind keyboard selection for subjects
    bindSubjectKeyboardSelection(handler) {
        const keyHandler = (e) => {
            // Only handle numeric keys 1-9
            if (e.key >= '1' && e.key <= '9') {
                const index = parseInt(e.key);
                const items = this.elements.subjectList.querySelectorAll('.subject-item');
                if (index > 0 && index <= items.length) {
                    const selectedItem = items[index - 1];
                    const subject = selectedItem.dataset.subject;
                    handler(subject);
                }
            }
        };
        
        document.addEventListener('keydown', keyHandler);
        // Store reference to remove later if needed
        this._subjectKeyHandler = keyHandler;
    }
    
    // Bind keyboard selection for operations
    bindOperationKeyboardSelection(handler) {
        const keyHandler = (e) => {
            // Only handle numeric keys 1-9
            if (e.key >= '1' && e.key <= '9') {
                const index = parseInt(e.key);
                const items = this.elements.operationList.querySelectorAll('.operation-item');
                if (index > 0 && index <= items.length) {
                    const selectedItem = items[index - 1];
                    const operation = selectedItem.dataset.operation;
                    handler(operation);
                }
            }
        };
        
        document.addEventListener('keydown', keyHandler);
        // Store reference to remove later if needed
        this._operationKeyHandler = keyHandler;
    }
    
    // Bind keyboard selection for levels
    bindLevelKeyboardSelection(handler) {
        const keyHandler = (e) => {
            // Only handle numeric keys 1-9
            if (e.key >= '1' && e.key <= '9') {
                const index = parseInt(e.key);
                const items = this.elements.levelList.querySelectorAll('.level-item');
                if (index > 0 && index <= items.length) {
                    const selectedItem = items[index - 1];
                    const level = parseInt(selectedItem.dataset.level);
                    const operation = selectedItem.dataset.operation;
                    handler(level, operation);
                }
            }
        };
        
        document.addEventListener('keydown', keyHandler);
        // Store reference to remove later if needed
        this._levelKeyHandler = keyHandler;
    }
    
    // Unbind keyboard selection handlers to prevent conflicts
    unbindKeyboardSelections() {
        if (this._subjectKeyHandler) {
            document.removeEventListener('keydown', this._subjectKeyHandler);
            this._subjectKeyHandler = null;
        }
        if (this._operationKeyHandler) {
            document.removeEventListener('keydown', this._operationKeyHandler);
            this._operationKeyHandler = null;
        }
        if (this._levelKeyHandler) {
            document.removeEventListener('keydown', this._levelKeyHandler);
            this._levelKeyHandler = null;
        }
    }
    
    // Bind input events
    bindInputEvents(submitHandler, focusHandler, blurHandler, backspaceHandler = null, inputFilter = null) {
        this.elements.terminalInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                submitHandler();
            }
        });
        
        // Handle Backspace for Bulgarian language wrong answers
        if (backspaceHandler) {
            this.elements.terminalInput.addEventListener('keydown', (e) => {
                if (e.key === 'Backspace') {
                    backspaceHandler();
                }
            });
        }
        
        // Apply input filter if provided
        if (inputFilter) {
            this.elements.terminalInput.addEventListener('keydown', (e) => {
                inputFilter(e);
            });
        }
        
        this.elements.terminalInput.addEventListener('focus', focusHandler);
        this.elements.terminalInput.addEventListener('blur', blurHandler);
    }
    
    // Bind click event on game screen to keep input focused
    bindGameScreenClick() {
        this.elements.gameScreen.addEventListener('click', (e) => {
            // Refocus input unless the click was on the input itself
            if (e.target !== this.elements.terminalInput) {
                this.focusInput();
            }
        });
    }
    
    // Hide/show cursor for input field
    hideCursor() {
        const cursor = document.querySelector('.cursor');
        if (cursor) cursor.style.display = 'none';
    }
    
    showCursor() {
        const cursor = document.querySelector('.cursor');
        if (cursor) cursor.style.display = 'inline-block';
    }
    
    // Render subject list
    renderSubjectList(subjects, localization) {
        if (!this.elements.subjectList) return;
        
        this.elements.subjectList.innerHTML = '';
        let index = 1;
        Object.keys(subjects).forEach(subjectName => {
            const subject = subjects[subjectName];
            const listItem = document.createElement('li');
            listItem.className = 'subject-item';
            listItem.dataset.subject = subjectName;
            listItem.dataset.index = index;
            const displayName = localization.t(subject.key);
            listItem.textContent = `${index}. ${subject.icon} ${displayName}`;
            this.elements.subjectList.appendChild(listItem);
            index++;
        });
    }
    
    // Render operation list
    renderOperationList(operations, localization) {
        if (!this.elements.operationList) return;
        
        this.elements.operationList.innerHTML = '';
        let index = 1;
        Object.keys(operations).forEach(operationName => {
            const operation = operations[operationName];
            const listItem = document.createElement('li');
            listItem.className = 'operation-item';
            listItem.dataset.operation = operationName;
            listItem.dataset.index = index;
            const displayName = localization.t(operation.key);
            listItem.textContent = `${index}. ${operation.icon} ${displayName}`;
            this.elements.operationList.appendChild(listItem);
            index++;
        });
    }
    
    // Render level list (for theme-independent structure)
    renderLevelList(levels) {
        if (!this.elements.levelList) return;
        
        this.elements.levelList.innerHTML = '';
        Object.keys(levels).forEach(levelNum => {
            const level = levels[levelNum];
            const listItem = document.createElement('li');
            listItem.className = 'level-item';
            listItem.dataset.level = levelNum;
            listItem.dataset.operation = 'current';
            listItem.textContent = `${levelNum}. ${level.description}`;
            this.elements.levelList.appendChild(listItem);
        });
    }
}