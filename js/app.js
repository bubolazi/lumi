// Application Entry Point - MVC Initialization with Subject Selection
class LumiApp {
    constructor() {
        this.init();
    }
    
    init() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.initializeMVC());
        } else {
            this.initializeMVC();
        }
    }
    
    initializeMVC() {
        // Initialize localization (Bulgarian by default)
        const localization = new LocalizationModel('bg');
        
        // Initialize subject manager
        const subjectManager = new SubjectManager();
        
        // Initialize controller with subject selection
        const controller = new AppController(localization, subjectManager);
        
        // Store references for potential future use
        this.localization = localization;
        this.subjectManager = subjectManager;
        this.controller = controller;
        
        // Make app instance available globally for debugging
        window.lumiApp = this;
        
        console.log('Learning App initialized with MVC architecture, Bulgarian localization, and subject selection');
    }
}

// Initialize the application
new LumiApp();