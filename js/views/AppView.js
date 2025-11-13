// View: UI rendering and DOM manipulation
class AppView {
    constructor(localization) {
        this.localization = localization;
        this.elements = {
            subjectSelect: document.getElementById('subject-select'),
            operationSelect: document.getElementById('operation-select'),
            levelSelect: document.getElementById('level-select'),
            gameScreen: document.getElementById('game-screen'),
            breadcrumbNav: document.getElementById('breadcrumb-nav'),
            problemDisplay: document.getElementById('problem-display'),
            problemDisplayCompact: document.getElementById('problem-display-compact'),
            calculationContainer: document.getElementById('calculation-container'),
            calculationHistory: document.getElementById('calculation-history'),
            standardDisplay: document.getElementById('standard-display'),
            terminalInput: document.getElementById('terminal-input'),
            scoreDisplay: document.getElementById('score-display'),
            problemsDisplay: document.getElementById('problems-display'),
            terminalMessage: document.getElementById('terminal-message'),
            subjectList: document.querySelector('.subject-list'),
            operationList: document.querySelector('.operation-list'),
            levelList: document.querySelector('.level-list'),
            userInfo: document.getElementById('user-info'),
            userDisplay: document.getElementById('user-display'),
            logoutButton: document.getElementById('logout-button'),
            loginModal: document.getElementById('login-modal'),
            loginInput: document.getElementById('login-input'),
            loginPrompt: document.getElementById('login-prompt'),
            passwordInput: document.getElementById('password-input'),
            passwordInputLine: document.getElementById('password-input-line'),
            loginInfo: document.getElementById('login-info'),
            loginInstructions: document.getElementById('login-instructions'),
            feedbackModal: document.getElementById('feedback-modal'),
            feedbackHeader: document.getElementById('feedback-header'),
            feedbackEmoji: document.getElementById('feedback-emoji'),
            feedbackBadge: document.getElementById('feedback-badge'),
            feedbackFooter: document.getElementById('feedback-footer')
        };
        
        // Track message state
        this.messageTimeout = null;
        this.messageVisible = false;
        
        // Track tooltip state
        this.tooltipVisible = false;
        this.currentTooltips = [];
        this.currentTooltipIndex = 0;
        this.currentSubject = null; // Will be set by controller
        
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
            this.showStandardDisplay();
            this.elements.problemDisplay.textContent = problem.display;
        } else if (problem.operation === 'place_value_recognition') {
            // Place Value Level 1 - Recognize ones or tens
            this.showStandardDisplay();
            const questionText = problem.questionType === 'ones' 
                ? this.localization.t('WHICH_DIGIT_ONES')
                : this.localization.t('WHICH_DIGIT_TENS');
            this.elements.problemDisplay.innerHTML = `<div class="place-value-number">${problem.display}</div><div class="place-value-question">${questionText}</div>`;
        } else if (problem.operation === 'place_value_calculation') {
            // Place Value Level 2 - Step-by-step calculation with history
            this.displayPlaceValueStep(problem);
        } else {
            // Standard math problem
            this.showStandardDisplay();
            this.elements.problemDisplay.textContent = 
                `${problem.num1} ${problem.operation} ${problem.num2} = ?`;
        }
    }
    
    // Show standard single-column display
    showStandardDisplay() {
        this.elements.standardDisplay.style.display = 'flex';
        this.elements.standardDisplay.style.flexDirection = 'column';
        this.elements.standardDisplay.style.alignItems = 'center';
        this.elements.calculationContainer.style.display = 'none';
    }
    
    // Show multi-step calculation display
    showMultiStepDisplay() {
        this.elements.standardDisplay.style.display = 'none';
        this.elements.calculationContainer.style.display = 'flex';
    }
    
    // Display Place Value step-by-step calculation
    displayPlaceValueStep(problem) {
        this.showMultiStepDisplay();
        
        const step = problem.currentStep || 1;
        const isAddition = problem.operationSign === '+';
        const opSign = problem.operationSign || '+';
        
        // Build calculation history with descriptive steps
        let historyHTML = '';
        
        // Main task - always visible and prominent
        historyHTML += `<div class="main-task">${problem.num1} ${opSign} ${problem.num2} = ?</div>`;
        
        // Step 1: Calculate ones
        if (step >= 1) {
            const status = step > 1 ? 'completed' : '';
            const stepDesc = this.localization.t(isAddition ? 'STEP_DESC_ONES' : 'STEP_DESC_ONES_SUB');
            const operation = `${problem.ones1} ${opSign} ${problem.ones2}`;
            let answer = '';
            if (step > 1) {
                if (isAddition) {
                    answer = ` = ${problem.onesSum}`;
                } else {
                    answer = ` = ${problem.onesFinal}`;
                }
            }
            historyHTML += `<div class="history-step ${status}"><span class="step-number">1️⃣</span><span class="step-content">${stepDesc}: ${operation}${answer}</span></div>`;
        }
        
        // Step 2: Determine carry/borrow
        if (step >= 2) {
            const status = step > 2 ? 'completed' : '';
            const stepDesc = this.localization.t(isAddition ? 'STEP_DESC_CARRY' : 'STEP_DESC_BORROW');
            let answer = '';
            if (step > 2) {
                if (isAddition) {
                    answer = `: ${problem.carryOver}`;
                } else {
                    answer = `: ${problem.borrow}`;
                }
            }
            const tooltip = ' <span class="tooltip-icon"><i>i</i></span>';
            historyHTML += `<div class="history-step ${status}"><span class="step-number">2️⃣</span><span class="step-content">${stepDesc}${answer}${tooltip}</span></div>`;
        }
        
        // Step 3: Calculate tens
        if (step >= 3) {
            const status = step > 3 ? 'completed' : '';
            const stepDesc = this.localization.t(isAddition ? 'STEP_DESC_TENS' : 'STEP_DESC_TENS_SUB');
            let operation, answer = '';
            if (isAddition) {
                const carryText = problem.carryOver > 0 ? ` + ${problem.carryOver}` : '';
                operation = `${problem.tens1} + ${problem.tens2}${carryText}`;
                answer = step > 3 ? ` = ${problem.tensFinal}` : '';
            } else {
                const borrowText = problem.borrow > 0 ? ` - ${problem.borrow}` : '';
                operation = `${problem.tens1} - ${problem.tens2}${borrowText}`;
                answer = step > 3 ? ` = ${problem.tensFinal}` : '';
            }
            historyHTML += `<div class="history-step ${status}"><span class="step-number">3️⃣</span><span class="step-content">${stepDesc}: ${operation}${answer}</span></div>`;
        }
        
        // Step 4: Combine result
        if (step >= 4) {
            const status = step > 4 ? 'completed' : '';
            const stepDesc = this.localization.t(isAddition ? 'STEP_DESC_COMBINE' : 'STEP_DESC_COMBINE_SUB');
            const operation = `${problem.tensFinal}0 + ${problem.onesFinal}`;
            const answer = step > 4 ? ` = ${problem.answer}` : '';
            historyHTML += `<div class="history-step ${status}"><span class="step-number">4️⃣</span><span class="step-content">${stepDesc}: ${operation}${answer}</span></div>`;
        }
        
        this.elements.calculationHistory.innerHTML = historyHTML;
        
        // Display current step question
        let currentStepText = '';
        let hasInfoIcon = false;
        
        if (step === 1) {
            currentStepText = `${problem.ones1} ${opSign} ${problem.ones2} = ?`;
        } else if (step === 2) {
            hasInfoIcon = true;
            const infoIcon = ` <span class="tooltip-icon">${this.localization.t('TOOLTIP_ICON')}</span>`;
            const label = isAddition ? 'Пренос' : 'Заемане';
            currentStepText = `${label} = ?${infoIcon}`;
        } else if (step === 3) {
            if (isAddition) {
                const carryText = problem.carryOver > 0 ? ` + ${problem.carryOver}` : '';
                currentStepText = `${problem.tens1} + ${problem.tens2}${carryText} = ?`;
            } else {
                const borrowText = problem.borrow > 0 ? ` - ${problem.borrow}` : '';
                currentStepText = `${problem.tens1} - ${problem.tens2}${borrowText} = ?`;
            }
        } else if (step === 4) {
            currentStepText = `${problem.tensFinal}0 + ${problem.onesFinal} = ?`;
        }
        
        // Update problem's hasInfoIcon flag
        problem.hasInfoIcon = hasInfoIcon;
        
        this.elements.problemDisplayCompact.innerHTML = currentStepText;
        
        // Update help text if info icon is present
        if (hasInfoIcon) {
            this.updateGameInstructions('TOOLTIP_HELP');
        } else {
            // Reset to default instructions
            const instructionKey = this.currentSubject === 'bulgarian' ? 'GAME_INSTRUCTIONS' : 'GAME_INSTRUCTIONS_MATH';
            this.updateGameInstructions(instructionKey);
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
        this.elements.scoreDisplay.textContent = `${this.localization.t('SCORE')}: ${gameState.score}`;
        this.elements.problemsDisplay.textContent = `${this.localization.t('PROBLEMS')}: ${gameState.problemsSolved}`;
    }
    
    // Show tooltip dialog
    showTooltip(tooltipKey) {
        const tooltipText = this.localization.t(tooltipKey);
        this.elements.terminalMessage.textContent = tooltipText;
        this.elements.terminalMessage.classList.add('show');
        this.tooltipVisible = true;
        this.updateGameInstructions('TOOLTIP_CLOSE');
    }
    
    // Hide tooltip dialog
    hideTooltip() {
        this.elements.terminalMessage.classList.remove('show');
        this.tooltipVisible = false;
        this.currentTooltips = [];
        this.currentTooltipIndex = 0;
        this.updateGameInstructions('TOOLTIP_HELP');
    }
    
    // Check if tooltip is visible
    isTooltipVisible() {
        return this.tooltipVisible;
    }
    
    // Cycle to next tooltip or close
    cycleTooltip(tooltips) {
        if (this.currentTooltipIndex < tooltips.length) {
            this.showTooltip(tooltips[this.currentTooltipIndex]);
            this.currentTooltipIndex++;
        } else {
            // All tooltips shown, close the dialog
            this.hideTooltip();
        }
    }
    
    // Initialize tooltips for current problem
    initializeTooltips(tooltips) {
        this.currentTooltips = tooltips;
        this.currentTooltipIndex = 0;
        this.tooltipVisible = false;
    }
    
    // Update breadcrumb navigation
    updateBreadcrumb(breadcrumbParts) {
        if (!this.elements.breadcrumbNav) return;
        
        if (!breadcrumbParts || breadcrumbParts.length === 0) {
            this.elements.breadcrumbNav.textContent = '';
            return;
        }
        
        this.elements.breadcrumbNav.textContent = breadcrumbParts.join(' > ');
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
                    e.preventDefault();
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
                    e.preventDefault();
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
                    e.preventDefault();
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
    
    // Unbind input event handlers to prevent conflicts
    unbindInputEvents() {
        if (this._submitHandler) {
            this.elements.terminalInput.removeEventListener('keypress', this._submitHandler);
            this._submitHandler = null;
        }
        if (this._deleteHandler) {
            this.elements.terminalInput.removeEventListener('keydown', this._deleteHandler);
            this._deleteHandler = null;
        }
        if (this._inputFilterHandler) {
            this.elements.terminalInput.removeEventListener('keydown', this._inputFilterHandler);
            this._inputFilterHandler = null;
        }
        if (this._focusHandler) {
            this.elements.terminalInput.removeEventListener('focus', this._focusHandler);
            this._focusHandler = null;
        }
        if (this._blurHandler) {
            this.elements.terminalInput.removeEventListener('blur', this._blurHandler);
            this._blurHandler = null;
        }
    }
    
    // Bind input events
    bindInputEvents(submitHandler, focusHandler, blurHandler, deleteHandler = null, inputFilter = null) {
        // Unbind any existing handlers first
        this.unbindInputEvents();
        
        // Create and store handler for Enter key
        this._submitHandler = (e) => {
            if (e.key === 'Enter') {
                submitHandler();
            }
        };
        this.elements.terminalInput.addEventListener('keypress', this._submitHandler);
        
        // Handle Delete for Bulgarian language wrong answers
        if (deleteHandler) {
            this._deleteHandler = (e) => {
                if (e.key === 'Delete' || e.key === 'Decimal' || e.key === '.') {
                    deleteHandler();
                    e.preventDefault();
                }
            };
            this.elements.terminalInput.addEventListener('keydown', this._deleteHandler);
        }
        
        // Apply input filter if provided
        if (inputFilter) {
            this._inputFilterHandler = (e) => {
                inputFilter(e);
            };
            this.elements.terminalInput.addEventListener('keydown', this._inputFilterHandler);
        }
        
        // Store focus and blur handlers
        this._focusHandler = focusHandler;
        this._blurHandler = blurHandler;
        this.elements.terminalInput.addEventListener('focus', this._focusHandler);
        this.elements.terminalInput.addEventListener('blur', this._blurHandler);
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
        let index = 1;
        Object.keys(levels).forEach(levelNum => {
            const level = levels[levelNum];
            const listItem = document.createElement('li');
            listItem.className = 'level-item';
            listItem.dataset.level = levelNum;
            listItem.dataset.operation = 'current';
            listItem.dataset.index = index;
            listItem.textContent = `${levelNum}. ${level.description}`;
            this.elements.levelList.appendChild(listItem);
            index++;
        });
    }
    
    updateUserDisplay(username) {
        if (!username) {
            this.elements.userInfo.style.display = 'none';
            return;
        }
        
        this.elements.userDisplay.textContent = `${this.localization.t('USER_LOGGED_IN')} ${username}`;
        this.elements.userInfo.style.display = 'flex';
    }
    
    bindLogoutButton(handler) {
        this.elements.logoutButton.addEventListener('click', handler);
    }
    
    promptUserLogin(callback) {
        this.elements.loginModal.style.display = 'flex';
        this.elements.loginInput.value = '';
        this.elements.passwordInput.value = '';
        this.elements.passwordInputLine.style.display = 'none';
        this.elements.loginInfo.style.display = 'none';
        this.elements.loginPrompt.textContent = 'ВЪВЕДИ ТВОЕТО ИМЕ ИЛИ ИМЕЙЛ:';
        this.elements.loginInstructions.textContent = 'НАТИСНИ ENTER ЗА ВХОД • ESC ЗА ОТКАЗ';
        
        const savedHandlers = {
            subject: this._subjectKeyHandler,
            operation: this._operationKeyHandler,
            level: this._levelKeyHandler
        };
        
        this.unbindKeyboardSelections();
        
        setTimeout(() => {
            this.elements.loginInput.value = '';
            this.elements.loginInput.focus();
        }, 0);
        
        let username = '';
        let isPasswordStep = false;
        
        const stopPropagation = (e) => {
            e.stopPropagation();
        };
        
        const isValidEmail = (str) => {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(str);
        };
        
        const handleSubmit = (e) => {
            if (e.key === 'Enter') {
                if (!isPasswordStep) {
                    username = this.elements.loginInput.value.trim();
                    if (username !== '') {
                        const isEmail = isValidEmail(username);
                        
                        if (isEmail) {
                            isPasswordStep = true;
                            this.elements.loginPrompt.textContent = 'ВЪВЕДИ ПАРОЛА:';
                            this.elements.passwordInputLine.style.display = 'flex';
                            this.elements.loginInfo.style.display = 'block';
                            this.elements.loginInfo.innerHTML = 'С ИМЕЙЛ И ПАРОЛА: СИНХРОНИЗАЦИЯ МЕЖДУ УСТРОЙСТВА<br>Ще получите имейл за потвърждение при първи вход';
                            this.elements.loginInstructions.textContent = 'ENTER = ПРОДЪЛЖИ • ESC = НАЗАД';
                            
                            this.elements.loginInput.removeEventListener('keydown', handleSubmit);
                            this.elements.passwordInput.addEventListener('keydown', handlePasswordSubmit);
                            this.elements.passwordInput.addEventListener('keydown', stopPropagation);
                            
                            setTimeout(() => {
                                this.elements.passwordInput.focus();
                            }, 0);
                        } else {
                            cleanup(true);
                            callback(username, '');
                        }
                    }
                }
            } else if (e.key === 'Escape') {
                cleanup(false);
            }
        };
        
        const handlePasswordSubmit = (e) => {
            if (e.key === 'Enter') {
                const password = this.elements.passwordInput.value.trim();
                cleanup(true);
                callback(username, password);
            } else if (e.key === 'Escape') {
                isPasswordStep = false;
                this.elements.passwordInputLine.style.display = 'none';
                this.elements.loginInfo.style.display = 'none';
                this.elements.loginPrompt.textContent = 'ВЪВЕДИ ТВОЕТО ИМЕ ИЛИ ИМЕЙЛ:';
                this.elements.loginInstructions.textContent = 'НАТИСНИ ENTER ЗА ВХОД • ESC ЗА ОТКАЗ';
                this.elements.passwordInput.value = '';
                
                this.elements.passwordInput.removeEventListener('keydown', handlePasswordSubmit);
                this.elements.loginInput.addEventListener('keydown', handleSubmit);
                
                setTimeout(() => {
                    this.elements.loginInput.focus();
                }, 0);
            }
        };
        
        const cleanup = (loginSuccessful) => {
            this.elements.loginModal.style.display = 'none';
            this.elements.loginInput.removeEventListener('keydown', handleSubmit);
            this.elements.loginInput.removeEventListener('keydown', stopPropagation);
            this.elements.passwordInput.removeEventListener('keydown', handlePasswordSubmit);
            this.elements.passwordInput.removeEventListener('keydown', stopPropagation);
            this.elements.loginInput.value = '';
            this.elements.passwordInput.value = '';
            this.elements.passwordInputLine.style.display = 'none';
            this.elements.loginInfo.style.display = 'none';
            
            if (!loginSuccessful) {
                if (savedHandlers.subject) {
                    this._subjectKeyHandler = savedHandlers.subject;
                    document.addEventListener('keydown', this._subjectKeyHandler);
                }
                if (savedHandlers.operation) {
                    this._operationKeyHandler = savedHandlers.operation;
                    document.addEventListener('keydown', this._operationKeyHandler);
                }
                if (savedHandlers.level) {
                    this._levelKeyHandler = savedHandlers.level;
                    document.addEventListener('keydown', this._levelKeyHandler);
                }
            }
        };
        
        this.elements.loginInput.addEventListener('keydown', stopPropagation);
        this.elements.loginInput.addEventListener('keydown', handleSubmit);
    }
    
    showBadgesMessage(badges, currentPage, totalPages, badgeCount) {
        const startIdx = (currentPage - 1) * 5;
        const endIdx = Math.min(startIdx + 5, badgeCount);
        
        let html = `<div class="badges-header">${this.localization.t('BADGES_TITLE')}</div>`;
        html += `<div class="badges-count">${this.localization.t('BADGES_COUNT')} ${badgeCount}</div>`;
        
        if (badges.length === 0) {
            html += `<div class="badges-list">${this.localization.t('NO_BADGES')}</div>`;
        } else {
            html += `<div class="badges-list">`;
            const pageBadges = badges.slice(startIdx, endIdx);
            pageBadges.forEach((badge, index) => {
                const badgeName = typeof badge === 'string' ? badge : badge.name;
                const badgeEmoji = typeof badge === 'string' ? '' : (badge.emoji || '');
                const displayText = badgeEmoji ? `${badgeEmoji} ${badgeName}` : badgeName;
                html += `<div class="badge-item">${startIdx + index + 1}. ${displayText}</div>`;
            });
            html += `</div>`;
            
            if (currentPage < totalPages) {
                html += `<div class="badges-instructions">${this.localization.t('BADGES_PRESS_STAR')}</div>`;
            } else {
                html += `<div class="badges-instructions">${this.localization.t('BADGES_CLOSE')}</div>`;
            }
        }
        
        this.elements.terminalMessage.innerHTML = html;
        this.elements.terminalMessage.classList.add('show');
        this.messageVisible = true;
    }
    
    showFeedbackModal(options) {
        const {
            isCorrect = true,
            badgeName = '',
            badgeEmoji = '',
            footer = '',
            header = ''
        } = options;
        
        this.elements.feedbackHeader.textContent = header 
            ? header
            : (isCorrect 
                ? this.localization.t('FEEDBACK_CORRECT')
                : this.localization.t('FEEDBACK_INCORRECT'));
        
        // If custom emoji provided, use it; otherwise follow default logic
        if (badgeEmoji) {
            this.elements.feedbackEmoji.textContent = badgeEmoji;
            this.elements.feedbackBadge.textContent = badgeName;
        } else if (badgeName) {
            // Badge name without custom emoji - show empty emoji
            this.elements.feedbackEmoji.textContent = '';
            this.elements.feedbackBadge.textContent = badgeName;
        } else if (!isCorrect) {
            this.elements.feedbackEmoji.textContent = this.localization.t('FEEDBACK_WRONG_EMOJI');
            this.elements.feedbackBadge.textContent = '';
        } else {
            const rewardEmojis = ['✨', '🌟', '⭐', '💫', '🎉', '🎊', '👏', '🏆'];
            const randomEmoji = rewardEmojis[Math.floor(Math.random() * rewardEmojis.length)];
            this.elements.feedbackEmoji.textContent = randomEmoji;
            this.elements.feedbackBadge.textContent = '';
        }
        
        this.elements.feedbackFooter.textContent = footer;
        
        this.elements.feedbackModal.classList.add('show');
        this.messageVisible = true;
    }
    
    hideFeedbackModal() {
        this.elements.feedbackModal.classList.remove('show');
        this.messageVisible = false;
    }
    
    isFeedbackModalVisible() {
        return this.elements.feedbackModal.classList.contains('show');
    }
}