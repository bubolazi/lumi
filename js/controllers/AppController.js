// Controller: Coordinates between Model and View
class AppController {
    constructor(localization, subjectManager, userStorage) {
        this.localization = localization;
        this.subjectManager = subjectManager;
        this.userStorage = userStorage;
        this.activityManager = null; // Will be set after subject selection
        this.view = new AppView(localization);
        this.model = null; // Will be initialized after operation/activity selection
        this.currentSubject = null; // Track current subject
        this.currentActivity = null; // Track current activity
        this.currentLevel = null; // Track current level
        this.navigationStack = []; // Stack for tracking navigation history
        this.badgesPage = 0; // Track current badges page
        this.badgesVisible = false; // Track if badges are visible
        
        // Bind global navigation handler
        this.bindGlobalNavigation();
        
        // Bind logout button
        this.view.bindLogoutButton(() => this.handleLogout());
        
        // Update user display
        this.updateUserDisplay();
        
        this.initializeSubjectSelection();
    }
    
    // Bind global keyboard handler for navigation
    bindGlobalNavigation() {
        this.globalNavigationHandler = (e) => {
            const loginModal = document.getElementById('login-modal');
            const isLoginVisible = loginModal && loginModal.style.display !== 'none';
            
            if (isLoginVisible) {
                return;
            }
            
            // Handle star (*) key globally for badge display
            if (e.key === '*') {
                const currentUser = this.userStorage.getCurrentUser();
                if (currentUser) {
                    e.preventDefault();
                    this.handleStarKey();
                }
                return;
            }
            
            // Only handle Backspace for navigation on selection screens
            if (e.key === 'Backspace') {
                // Check which screen is active
                const activeScreen = document.querySelector('.screen.active');
                if (!activeScreen) return;
                
                const screenId = activeScreen.id;
                
                // Only navigate back from selection screens (not game screen)
                // Game screen handles its own navigation through input filter
                if (screenId === 'level-select' || screenId === 'operation-select' || screenId === 'subject-select') {
                    // Prevent browser's default back navigation
                    e.preventDefault();
                    
                    // Check if we can navigate back
                    if (this.navigationStack.length > 0) {
                        this.navigateBack();
                    }
                }
            }
        };
        
        document.addEventListener('keydown', this.globalNavigationHandler);
    }
    
    // Helper method to push state to navigation stack only if not already on top
    pushToStackIfNotPresent(state) {
        const topOfStack = this.navigationStack.length > 0 
            ? this.navigationStack[this.navigationStack.length - 1] 
            : null;
        if (topOfStack !== state) {
            this.navigationStack.push(state);
        }
    }
    
    initializeSubjectSelection() {
        this.currentSubject = null;
        this.currentActivity = null;
        this.currentLevel = null;
        this.navigationStack = [];
        
        // Show subject selection screen
        this.view.showScreen('subject-select');
        
        // Clear breadcrumb
        this.view.updateBreadcrumb([]);
        
        // Render available subjects
        this.view.renderSubjectList(this.subjectManager.getAvailableSubjects(), this.localization);
        
        // Unbind any previous keyboard selections
        this.view.unbindKeyboardSelections();
        
        // Bind subject selection event
        this.view.bindSubjectSelection((subject) => {
            this.selectSubject(subject);
        });
        
        // Bind keyboard selection
        this.view.bindSubjectKeyboardSelection((subject) => {
            this.selectSubject(subject);
        });
    }
    
    selectSubject(subjectName) {
        const currentUser = this.userStorage.getCurrentUser();
        
        if (!currentUser) {
            this.view.promptUserLogin(async (username, password) => {
                if (await this.userStorage.setCurrentUser(username, password)) {
                    this.updateUserDisplay();
                    this.proceedWithSubjectSelection(subjectName);
                }
            });
        } else {
            this.proceedWithSubjectSelection(subjectName);
        }
    }
    
    proceedWithSubjectSelection(subjectName) {
        this.currentSubject = subjectName;
        this.currentActivity = null;
        this.currentLevel = null;
        this.navigationStack = [];
        
        // Pass current subject to view
        this.view.currentSubject = subjectName;
        
        // Get the activity manager for this subject
        this.activityManager = this.subjectManager.getActivityManager(subjectName);
        if (!this.activityManager) {
            console.error(`Subject ${subjectName} not found`);
            return;
        }
        
        // Update breadcrumb
        const subjectKey = this.subjectManager.getSubjectKey(subjectName);
        this.view.updateBreadcrumb([this.localization.t(subjectKey)]);
        
        // Show operation/activity selection
        this.initializeOperationSelection();
    }
    
    initializeOperationSelection() {
        // Push 'subject' to navigation stack when showing operations
        this.pushToStackIfNotPresent('subject');
        
        // Show operation selection screen
        this.view.showScreen('operation-select');
        
        // Render available operations/activities
        this.view.renderOperationList(this.activityManager.getAvailableOperations(), this.localization);
        
        // Unbind any previous keyboard selections
        this.view.unbindKeyboardSelections();
        
        // Bind operation selection event
        this.view.bindOperationSelection((operation) => {
            this.selectOperation(operation);
        });
        
        // Bind keyboard selection
        this.view.bindOperationKeyboardSelection((operation) => {
            this.selectOperation(operation);
        });
    }
    
    selectOperation(operationName) {
        this.currentActivity = operationName;
        
        // Only push 'activity' if it's not already on the stack
        this.pushToStackIfNotPresent('activity');
        
        // Get the operation extension
        const operationExtension = this.activityManager.getOperationExtension(operationName);
        if (!operationExtension) {
            console.error(`Operation ${operationName} not found`);
            return;
        }
        
        // Initialize the model with the selected operation
        // Choose the correct model class based on subject
        if (this.currentSubject === 'math') {
            this.model = new MathModel(this.localization, operationExtension);
        } else if (this.currentSubject === 'bulgarian') {
            this.model = new BulgarianLanguageModel(this.localization, operationExtension);
        }
        
        // Update breadcrumb
        const subjectKey = this.subjectManager.getSubjectKey(this.currentSubject);
        const activityKey = this.activityManager.getOperationKey(operationName);
        this.view.updateBreadcrumb([
            this.localization.t(subjectKey),
            this.localization.t(activityKey)
        ]);
        
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
        this.pushToStackIfNotPresent('level_select');
        
        // Render level list for the selected operation
        this.view.renderLevelList(this.model.getLocalizedLevels());
        
        // Unbind any previous keyboard selections
        this.view.unbindKeyboardSelections();
        
        // Bind level selection event
        this.view.bindLevelSelection((level, operation) => {
            this.startLevel(level, operation);
        });
        
        // Bind keyboard selection
        this.view.bindLevelKeyboardSelection((level, operation) => {
            this.startLevel(level, operation);
        });
        
        // Show level selection screen
        this.view.showScreen('level-select');
        this.view.updateGameStatus(this.model.getGameState());
    }
    
    // Start a new level
    startLevel(level, operation) {
        if (!this.model) {
            console.error('Model not initialized. Select an operation first.');
            return;
        }
        
        this.currentLevel = level;
        
        // Only push 'game' if it's not already on the stack
        this.pushToStackIfNotPresent('game');
        
        // Unbind keyboard selections when entering game screen
        this.view.unbindKeyboardSelections();
        
        this.model.setLevel(level, operation);
        this.model.resetStats();
        this.view.showScreen('game-screen');
        
        // Update breadcrumb with level description (not "LEVEL X")
        const subjectKey = this.subjectManager.getSubjectKey(this.currentSubject);
        const activityKey = this.activityManager.getOperationKey(this.currentActivity);
        const levels = this.model.getLocalizedLevels();
        const levelDescription = levels[level] ? levels[level].description : `${this.localization.t('LEVEL')} ${level}`;
        
        this.view.updateBreadcrumb([
            this.localization.t(subjectKey),
            this.localization.t(activityKey),
            levelDescription
        ]);
        
        // Update game instructions based on subject
        if (this.currentSubject === 'bulgarian') {
            this.view.updateGameInstructions('GAME_INSTRUCTIONS');
        } else {
            this.view.updateGameInstructions('GAME_INSTRUCTIONS_MATH');
        }
        
        this.generateNewProblem();
        this.view.updateGameStatus(this.model.getGameState());
        
        // Bind input events when starting the game
        this.bindGameEvents();
    }
    
    bindGameEvents() {
        // Bind input events
        // For Bulgarian: Delete or Decimal (numpad period) marks wrong answer
        const deleteHandler = (this.currentSubject === 'bulgarian') 
            ? () => this.handleDeleteKey() 
            : null;
        
        // Create input filter based on subject
        let inputFilter = null;
        if (this.currentSubject === 'bulgarian') {
            // Bulgarian: block all character input, allow only navigation/control keys
            inputFilter = (e) => {
                // Handle backspace for navigation only
                if (e.key === 'Backspace') {
                    // Prevent default browser behavior
                    e.preventDefault();
                    // Stop event from bubbling to global handler
                    e.stopPropagation();
                    // Navigate back (input content doesn't matter for Bulgarian - always navigate)
                    this.navigateBack();
                    return;
                }
                
                // Handle Delete or Decimal (numpad period) for marking wrong answer
                if (e.key === 'Delete' || e.key === 'Decimal' || e.key === '.') {
                    // Handled by deleteHandler
                    return;
                }
                
                // Allow: Tab, Enter, Escape, Arrow keys
                const allowedKeys = ['Tab', 'Enter', 'Escape', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'];
                if (allowedKeys.includes(e.key)) {
                    return; // Allow these keys
                }
                // Block all other input
                e.preventDefault();
            };
        } else if (this.currentSubject === 'math') {
            // Math: allow only numeric input (0-9) and backspace navigation
            inputFilter = (e) => {
                // Handle + key for tooltips
                if (e.key === '+' || e.key === '=') { // = is + on many keyboards without shift
                    this.handlePlusKey();
                    e.preventDefault();
                    return;
                }
                
                // Handle backspace for navigation
                if (e.key === 'Backspace') {
                    // Check if input is empty - if so, navigate back
                    if (this.view.getUserInput() === '') {
                        e.preventDefault();
                        e.stopPropagation(); // Stop event from bubbling to global handler
                        this.navigateBack();
                        return;
                    }
                    // Otherwise, allow normal backspace behavior
                    return;
                }
                
                // Allow: Tab, Enter, Escape, Arrow keys, Delete
                const allowedKeys = ['Tab', 'Enter', 'Escape', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Delete'];
                if (allowedKeys.includes(e.key)) {
                    return; // Allow control keys
                }
                // Allow only digits 0-9
                if (e.key >= '0' && e.key <= '9') {
                    return; // Allow numeric input
                }
                // Block all other input (letters, symbols, etc.)
                e.preventDefault();
            };
        }
        
        this.view.bindInputEvents(
            () => this.handleEnterKey(),        // Submit/dismiss handler
            () => this.view.hideCursor(),       // Focus handler
            () => this.view.showCursor(),       // Blur handler
            deleteHandler,                      // Delete handler (Bulgarian only)
            inputFilter                         // Input filter
        );
        
        // Bind click on game screen to keep input focused
        this.view.bindGameScreenClick();
    }
    
    // Handle Enter key press - dismiss message or check answer
    async handleEnterKey() {
        // If feedback modal is visible, dismiss it first
        if (this.view.isFeedbackModalVisible()) {
            this.view.hideFeedbackModal();
            this.view.clearAndFocusInput();
            
            // Check if we're in the middle of a multi-step Place Value problem
            const problem = this.model.currentProblem;
            if (problem && problem.operation === 'place_value_calculation' && problem.currentStep && problem.currentStep < 5) {
                // Don't generate new problem - we're still in multi-step mode
                // Just clear the message and wait for next input
                return;
            }
            
            // Generate next problem after dismissing
            this.generateNewProblem();
            return;
        }
        
        // If a message is visible, dismiss it first
        if (this.view.isMessageVisible()) {
            this.view.hideMessage();
            this.view.clearAndFocusInput();
            
            // Check if we're in the middle of a multi-step Place Value problem
            const problem = this.model.currentProblem;
            if (problem && problem.operation === 'place_value_calculation' && problem.currentStep && problem.currentStep < 5) {
                // Don't generate new problem - we're still in multi-step mode
                // Just clear the message and wait for next input
                return;
            }
            
            // Generate next problem after dismissing
            this.generateNewProblem();
            return;
        }
        
        // Otherwise, check the answer
        await this.checkAnswer();
    }
    
    // Handle + key press - show tooltips if available
    handlePlusKey() {
        const problem = this.model.currentProblem;
        
        // Check if current problem has info icon (tooltips available)
        if (problem && problem.hasInfoIcon) {
            // Determine which tooltip to show based on operation
            const tooltipKey = problem.operationSign === '-' ? 'TOOLTIP_BORROW' : 'TOOLTIP_CARRY';
            
            if (this.view.isTooltipVisible()) {
                // Tooltip is visible, cycle to next or close
                this.view.cycleTooltip([tooltipKey]);
            } else {
                // No tooltip visible, initialize and show first one
                this.view.initializeTooltips([tooltipKey]);
                this.view.cycleTooltip([tooltipKey]);
            }
        }
    }
    
    // Handle Delete key press - submit wrong answer for Bulgarian subject
    handleDeleteKey() {
        // If feedback modal is visible, dismiss it first
        if (this.view.isFeedbackModalVisible()) {
            this.view.hideFeedbackModal();
            this.view.clearAndFocusInput();
            // Generate next problem after dismissing
            this.generateNewProblem();
            return;
        }
        
        // If a message is visible, dismiss it first
        if (this.view.isMessageVisible()) {
            this.view.hideMessage();
            this.view.clearAndFocusInput();
            // Generate next problem after dismissing
            this.generateNewProblem();
            return;
        }
        
        // For Bulgarian subject, Delete means wrong answer
        this.checkAnswerAsWrong();
    }
    
    // Generate and display a new problem
    generateNewProblem() {
        // Hide any visible message first
        this.view.hideMessage();
        
        const problem = this.model.generateProblem();
        this.view.displayProblem(problem);
        this.view.clearAndFocusInput();
    }
    
    // Check the user's answer
    async checkAnswer() {
        const userInput = this.view.getUserInput();
        
        // For Bulgarian Language, allow empty input (parent just presses Enter)
        // For Math, require a number
        if (this.currentSubject === 'bulgarian') {
            // Bulgarian: only empty (Enter for correct) is valid
            // Wrong answers are submitted via Backspace, not by typing
            if (userInput !== '') {
                this.view.showMessage(this.model.localization.t('ERROR_INVALID_INPUT'), false);
                return;
            }
        } else {
            // Math: require a number
            if (!userInput || isNaN(parseInt(userInput))) {
                this.view.showMessage(this.model.localization.t('ERROR_INVALID_INPUT'), false);
                return;
            }
        }
        
        // Check if this is a multi-step Place Value problem
        const problem = this.model.currentProblem;
        if (problem.operation === 'place_value_calculation' && problem.currentStep) {
            await this.checkPlaceValueStep(parseInt(userInput));
            return;
        }
        
        if (this.model.checkAnswer(userInput)) {
            // Correct answer
            this.model.updateScore();
            
            // Check if user earned a badge
            const badgeData = this.model.checkBadge();
            if (badgeData) {
                const badgeEmoji = await this.saveBadge(badgeData.badgeName);
                this.view.showFeedbackModal({
                    isCorrect: true,
                    badgeName: badgeData.badgeName,
                    badgeEmoji: badgeEmoji,
                    header: `${this.localization.t('FEEDBACK_CORRECT')} ${this.localization.t('BADGE_MESSAGE')}`,
                    footer: this.model.getRandomRewardMessage()
                });
            } else {
                this.view.showFeedbackModal({
                    isCorrect: true,
                    footer: this.model.getRandomRewardMessage()
                });
            }
            
            this.view.updateGameStatus(this.model.getGameState());
        } else {
            // Incorrect answer
            if (this.currentSubject === 'bulgarian') {
                // For Bulgarian, there's no "correct answer" to show
                this.view.showFeedbackModal({
                    isCorrect: false,
                    footer: this.localization.t('INCORRECT_ANSWER_BULGARIAN')
                });
            } else {
                const correctAnswer = this.model.currentProblem.answer;
                this.view.showFeedbackModal({
                    isCorrect: false,
                    footer: `${this.localization.t('INCORRECT_ANSWER')} ${correctAnswer}`
                });
            }
        }
    }
    
    // Check Place Value step-by-step answer
    async checkPlaceValueStep(userAnswer) {
        const problem = this.model.currentProblem;
        const currentStep = problem.currentStep;
        const expectedAnswer = problem.stepAnswers[currentStep - 1];
        
        if (userAnswer === expectedAnswer) {
            // Correct answer for this step
            if (currentStep < 4) {
                // Move to next step
                problem.currentStep++;
                this.view.showMessage('ПРАВИЛНО! Следваща стъпка...', false);
                // After a short delay, show the next step
                setTimeout(() => {
                    this.view.hideMessage();
                    this.view.displayProblem(problem);
                    this.view.clearAndFocusInput();
                }, 1500);
            } else {
                // Final step completed - award points and show message
                this.model.updateScore();
                
                const badgeData = this.model.checkBadge();
                if (badgeData) {
                    const badgeEmoji = await this.saveBadge(badgeData.badgeName);
                    this.view.showFeedbackModal({
                        isCorrect: true,
                        badgeName: badgeData.badgeName,
                        badgeEmoji: badgeEmoji,
                        header: `${this.localization.t('FEEDBACK_CORRECT')} ${this.localization.t('BADGE_MESSAGE')}`,
                        footer: this.model.getRandomRewardMessage()
                    });
                } else {
                    this.view.showFeedbackModal({
                        isCorrect: true,
                        footer: this.model.getRandomRewardMessage()
                    });
                }
                
                this.view.updateGameStatus(this.model.getGameState());
                
                // Mark that we've completed all steps so next Enter generates new problem
                problem.currentStep = 5;
            }
        } else {
            // Incorrect answer
            this.view.showFeedbackModal({
                isCorrect: false,
                footer: `${this.model.localization.t('INCORRECT_ANSWER')} ${expectedAnswer}`
            });
        }
    }
    
    // Check answer as wrong (for Backspace submissions in Bulgarian)
    checkAnswerAsWrong() {
        // For Bulgarian subject, show incorrect answer message
        this.view.showFeedbackModal({
            isCorrect: false,
            footer: this.localization.t('INCORRECT_ANSWER_BULGARIAN')
        });
    }
    
    // Navigate back to the previous screen
    navigateBack() {
        // Pop current state
        if (this.navigationStack.length > 0) {
            this.navigationStack.pop();
        }
        
        // Get previous state
        const previousState = this.navigationStack.length > 0 
            ? this.navigationStack[this.navigationStack.length - 1] 
            : null;
        
        if (previousState === 'level_select') {
            // Go back to level selection - don't push to stack again
            this.showLevelSelection();
        } else if (previousState === 'activity') {
            // Go back to operation/activity selection - don't modify stack
            this.showOperationSelection();
        } else if (previousState === 'subject') {
            // Go back to subject selection - don't modify stack
            this.showSubjectSelection();
        } else {
            // No more history - show subject selection without resetting
            this.showSubjectSelection();
        }
        
        return previousState;
    }
    
    // Show level selection without modifying navigation stack
    showLevelSelection() {
        // Render level list for the selected operation
        this.view.renderLevelList(this.model.getLocalizedLevels());
        
        // Unbind any previous keyboard selections
        this.view.unbindKeyboardSelections();
        
        // Bind level selection event
        this.view.bindLevelSelection((level, operation) => {
            this.startLevel(level, operation);
        });
        
        // Bind keyboard selection
        this.view.bindLevelKeyboardSelection((level, operation) => {
            this.startLevel(level, operation);
        });
        
        // Show level selection screen
        this.view.showScreen('level-select');
        
        // Update breadcrumb
        const subjectKey = this.subjectManager.getSubjectKey(this.currentSubject);
        const activityKey = this.activityManager.getOperationKey(this.currentActivity);
        this.view.updateBreadcrumb([
            this.localization.t(subjectKey),
            this.localization.t(activityKey)
        ]);
        
        this.view.updateGameStatus(this.model.getGameState());
    }
    
    // Show operation/activity selection without modifying navigation stack
    showOperationSelection() {
        // Show operation selection screen
        this.view.showScreen('operation-select');
        
        // Render available operations/activities
        this.view.renderOperationList(this.activityManager.getAvailableOperations(), this.localization);
        
        // Unbind any previous keyboard selections
        this.view.unbindKeyboardSelections();
        
        // Bind operation selection event
        this.view.bindOperationSelection((operation) => {
            this.selectOperation(operation);
        });
        
        // Bind keyboard selection
        this.view.bindOperationKeyboardSelection((operation) => {
            this.selectOperation(operation);
        });
        
        // Update breadcrumb
        const subjectKey = this.subjectManager.getSubjectKey(this.currentSubject);
        this.view.updateBreadcrumb([this.localization.t(subjectKey)]);
    }
    
    // Show subject selection without modifying navigation stack
    showSubjectSelection() {
        // Show subject selection screen
        this.view.showScreen('subject-select');
        
        // Render available subjects
        this.view.renderSubjectList(this.subjectManager.getAvailableSubjects(), this.localization);
        
        // Unbind any previous keyboard selections
        this.view.unbindKeyboardSelections();
        
        // Bind subject selection event
        this.view.bindSubjectSelection((subject) => {
            this.selectSubject(subject);
        });
        
        // Bind keyboard selection
        this.view.bindSubjectKeyboardSelection((subject) => {
            this.selectSubject(subject);
        });
        
        // Update breadcrumb (empty at subject level)
        this.view.updateBreadcrumb([]);
    }
    
    updateUserDisplay() {
        const currentUser = this.userStorage.getCurrentUser();
        this.view.updateUserDisplay(currentUser);
    }
    
    handleLogout() {
        this.userStorage.logout();
        this.updateUserDisplay();
        this.initializeSubjectSelection();
    }
    
    async handleStarKey() {
        const currentUser = this.userStorage.getCurrentUser();
        if (!currentUser) {
            return;
        }
        
        const badges = await this.userStorage.getBadges(currentUser);
        const badgeCount = badges.length;
        const totalPages = Math.ceil(badgeCount / 5) || 1;
        
        if (!this.badgesVisible) {
            this.badgesPage = 1;
            this.badgesVisible = true;
            this.view.showBadgesMessage(badges, this.badgesPage, totalPages, badgeCount);
        } else {
            this.badgesPage++;
            if (this.badgesPage > totalPages) {
                this.badgesVisible = false;
                this.badgesPage = 0;
                this.view.hideMessage();
            } else {
                this.view.showBadgesMessage(badges, this.badgesPage, totalPages, badgeCount);
            }
        }
    }
    
    async saveBadge(badgeMessage) {
        const currentUser = this.userStorage.getCurrentUser();
        if (currentUser) {
            const animalName = this.localization.extractAnimalFromBadge(badgeMessage);
            const badgeEmoji = this.localization.getBadgeEmoji(animalName);
            await this.userStorage.addBadge(currentUser, badgeMessage, badgeEmoji);
            return badgeEmoji;
        }
        return '⭐';
    }
}