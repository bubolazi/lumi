// Jest setup file - load browser JS classes into global scope
const fs = require('fs');
const path = require('path');

// List of files to load (relative to project root)
const files = [
    'js/models/core/LocalizationModel.js',
    'js/models/core/UserStorageModel.js',
    'js/models/subjects/math/activities/AdditionLevels.js',
    'js/models/subjects/math/activities/SubtractionLevels.js',
    'js/models/subjects/math/activities/PlaceValueActivity.js',
    'js/models/subjects/math/OperationManager.js',
    'js/models/subjects/math/MathModel.js',
    'js/models/subjects/bulgarian/activities/LettersActivity.js',
    'js/models/subjects/bulgarian/activities/SyllablesActivity.js',
    'js/models/subjects/bulgarian/activities/WordsActivity.js',
    'js/models/subjects/bulgarian/BulgarianActivityManager.js',
    'js/models/subjects/bulgarian/BulgarianLanguageModel.js',
    'js/models/core/SubjectManager.js'
];

// Load each file and make classes available globally
// We need to capture class declarations and assign them to global
files.forEach(file => {
    const filePath = path.join(__dirname, '..', file);
    const code = fs.readFileSync(filePath, 'utf8');
    
    // Extract class names from the code
    const classMatches = code.match(/class\s+(\w+)/g);
    if (classMatches) {
        classMatches.forEach(match => {
            const className = match.replace('class ', '');
            // Wrap the code to assign the class to global
            const wrappedCode = `
                ${code}
                globalThis.${className} = ${className};
            `;
            eval(wrappedCode);
        });
    } else {
        // No class declarations, just eval the code
        eval(code);
    }
});
