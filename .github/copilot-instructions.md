# Copilot Instructions for Lumi

## Project Overview

Lumi is a beautiful, kid-friendly web application for preschool children to learn and practice various subjects including math and Bulgarian language. The application features:
- Green monochrome theme
- Progressive difficulty levels
- Multi-step calculation visualization
- Reward system for encouragement
- Pure JavaScript with no external runtime dependencies

## Architecture

### MVC Pattern
The application follows a **Model-View-Controller (MVC)** architecture:

- **Models** (`js/models/`): Handle data and business logic
  - `core/`: Core functionality (LocalizationModel, SubjectManager)
  - `subjects/`: Subject-specific models (MathModel, BulgarianLanguageModel)
  - Each subject has an activity manager and individual activity classes
  
- **Views** (`js/views/`): Handle UI rendering
  - AppView: Main view controller for rendering all UI components

- **Controllers** (`js/controllers/`): Coordinate application flow
  - AppController: Manages navigation and state

- **Entry Point** (`js/app.js`): Initialize the MVC stack with LumiApp class

### Key Components

1. **Subject System**: Extensible subject management via SubjectManager
2. **Activity System**: Each subject contains multiple activities with different levels
3. **Localization**: Bulgarian language support via LocalizationModel
4. **Navigation Stack**: Manages backward navigation with state preservation

## Coding Standards

### General Guidelines
- **Pure JavaScript**: No external dependencies for the app (devDependencies for testing only)
- **ES6+ Features**: Use modern JavaScript features (classes, arrow functions, etc.)
- **No Comments**: Code should be self-documenting; avoid comments unless absolutely necessary for complex logic
- **Semantic Naming**: Use clear, descriptive names for variables, functions, and classes

### File Organization
- One class per file
- File names match class names (e.g., `MathModel.js` for `MathModel` class)
- Group related files in appropriate subdirectories
- Keep HTML, CSS, and JS separate

### Class Structure
```javascript
class MyNewActivity {
    constructor(params) {
        // Initialize properties
    }
    
    generateProblem() {
        // Core logic
    }
    
    checkAnswer(userAnswer) {
        // Validation logic
    }
}
```

## Testing Requirements

### Test Framework
- **Jest** with jsdom for browser environment simulation
- All tests in `tests/` directory with `.test.js` suffix
- Test setup in `tests/setup.js` loads all JS files

### Running Tests
```bash
npm test              # Run all tests
npm run test:watch    # Watch mode for development
npm run test:coverage # Generate coverage report
```

### Test Coverage Requirements
- **All new features must include tests**
- Test both happy paths and edge cases
- Maintain 100% test pass rate
- Group related tests in `describe` blocks

### Writing Tests
```javascript
describe('Feature Name - Component', () => {
    let model;

    beforeEach(() => {
        model = new FeatureModel();
    });

    test('should perform expected behavior', () => {
        const result = model.someMethod();
        expect(result).toBe(expectedValue);
    });
});
```

## Adding New Features

### Adding a New Subject
1. Create model in `js/models/subjects/[subject-name]/`
2. Create `[SubjectName]Model.js` (main model)
3. Create `[SubjectName]ActivityManager.js` (manages activities)
4. Create `activities/` subdirectory with activity classes
5. Register subject in `SubjectManager.js`
6. Add localization entries in `LocalizationModel.js`
7. Write comprehensive tests in `tests/`

### Adding a New Activity
1. Create activity class in appropriate `activities/` directory
2. Implement `generateProblem()` and `checkAnswer()` methods
3. Register activity in the subject's ActivityManager
4. Add localization strings if needed
5. Write tests covering all difficulty levels

### Adding a New Level
1. Add level configuration to activity class
2. Ensure problem generation adapts to level parameters
3. Test the new level thoroughly

## UI/UX Guidelines

### Theme
- **Green monochrome**: Use existing color palette from `styles.css` or `css/themes/`
- **Large buttons**: Kid-friendly touch targets
- **Clear typography**: Use existing font sizes and families
- **Responsive design**: Support desktop, tablet, and mobile

### Feedback
- Animated reward messages for correct answers
- Clear visual indication of progress
- Encouraging messages (defined in LocalizationModel)

### Multi-Step Calculations
- Display calculation history for complex problems
- Use emoji indicators for step progression (📝 1️⃣ 2️⃣ 3️⃣ 4️⃣)
- Keep information concise with tooltips for details

## Development Workflow

### Before Making Changes
1. Pull latest changes and install dependencies: `npm install`
2. Run tests to ensure starting point is clean: `npm test`
3. Review relevant existing code and tests

### Making Changes
1. Follow MVC pattern and maintain separation of concerns
2. Keep changes minimal and focused
3. Write/update tests alongside code changes
4. Test frequently during development

### Before Committing
1. Run full test suite: `npm test`
2. Ensure all tests pass
3. Verify no unintended files are staged (check `.gitignore`)
4. Review changes for code quality

### CI/CD
- GitHub Actions run tests on push and PR
- Tests run on Node.js 18.x and 20.x
- Coverage reports uploaded to Codecov

## Common Patterns

### Problem Generation
```javascript
generateProblem() {
    const problem = {
        question: "What is 2 + 2?",
        answer: 4,
        displayText: "2 + 2 = ?"
    };
    return problem;
}
```

### Answer Validation
```javascript
checkAnswer(userAnswer) {
    return userAnswer === this.currentProblem.answer;
}
```

### State Management
- Controller manages navigation stack
- Models maintain their own state
- View renders based on controller state

## Documentation

### README Updates
- Update main README.md for major feature additions
- Keep feature list current
- Document new subjects or activities

### Test Documentation
- Update `tests/README.md` when adding new test suites
- Document test coverage for new features

## Troubleshooting

### Test Issues
- Ensure tests are in `tests/` directory
- Check `tests/setup.js` loads required files
- Use `test.only()` for debugging specific tests

### Navigation Issues
- Check navigation stack in AppController
- Ensure state preservation in navigate() method
- Test backspace navigation thoroughly

### Localization Issues
- Add all new strings to LocalizationModel
- Maintain consistency in naming conventions
- Test with Bulgarian locale

## Quick Reference

### File Structure
```
lumi/
├── index.html           # Main entry point
├── css/                 # Stylesheets
│   ├── base.css
│   └── themes/
├── js/                  # Application code
│   ├── app.js          # Entry point
│   ├── controllers/
│   ├── models/
│   │   ├── core/
│   │   └── subjects/
│   └── views/
├── tests/              # Test suite
└── docs/               # Documentation
```

### Key Commands
```bash
npm install             # Install dependencies
npm test               # Run tests
npm run test:watch     # Watch mode
npm run test:coverage  # Coverage report
python3 -m http.server # Run local server
```

### Key Classes
- `LumiApp`: Application entry point
- `AppController`: Navigation and flow
- `AppView`: UI rendering
- `SubjectManager`: Subject registration
- `LocalizationModel`: Translations
- `MathModel`, `BulgarianLanguageModel`: Subject implementations

## Best Practices Summary

1. ✅ Follow MVC architecture strictly
2. ✅ Write tests for all new features
3. ✅ Keep code self-documenting
4. ✅ Maintain pure JavaScript (no external runtime dependencies)
5. ✅ Use existing patterns for consistency
6. ✅ Test on multiple Node.js versions (18.x, 20.x)
7. ✅ Keep the green monochrome theme
8. ✅ Design for kids (large buttons, clear feedback)
9. ✅ Support progressive difficulty levels
10. ✅ Ensure responsive design

## Questions?

For additional guidance, refer to:
- Main README: `/README.md`
- Test documentation: `/tests/README.md`
- Example implementations in `js/models/subjects/`
