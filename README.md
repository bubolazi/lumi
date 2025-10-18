# Learning Practice for Kids

A beautiful, kid-friendly web application for preschool children to practice basic math operations. Features a green monochrome theme and progressive difficulty levels.

## Features

### 🎨 Green Monochrome Theme
- Beautiful gradient backgrounds
- Consistent green color palette
- Kid-friendly fonts and large buttons
- Responsive design for all devices

### 📚 Progressive Learning Levels
**Addition Practice:**
- **Level 1**: Single digits (1-9)
- **Level 2**: Double digits (10-19)  
- **Level 3**: Up to 20
- **Level 4**: Up to 50
- **Level 5**: Up to 100

### 🎉 Reward System
- Animated reward messages for correct answers
- Automatic progression to next problems
- Score tracking and problem counter
- Encouraging feedback messages

### 🚀 Easy to Extend
The application is built with a modular architecture that makes it easy to add:
- New math operations (subtraction, multiplication, division)
- Additional difficulty levels
- Different UI themes
- More reward types

## Getting Started

### Option 1: Direct File Access
Simply open `index.html` in any modern web browser.

### Option 2: Local Server
For the best experience, serve the files using a local web server:

```bash
# Using Python 3
python3 -m http.server 8000

# Using Node.js
npx serve .

# Using PHP
php -S localhost:8000
```

Then open `http://localhost:8000` in your browser.

## File Structure

```
lumi/
├── index.html           # Main HTML structure
├── css/                 # Stylesheets
│   ├── base.css        # Theme-independent styles
│   └── themes/         # Theme-specific styles
├── js/                  # Application code
│   ├── app.js          # Application entry point
│   ├── models/         # Data and business logic
│   │   ├── core/       # Core models (localization, subject management)
│   │   └── subjects/   # Subject-specific models and activities
│   │       ├── math/
│   │       └── bulgarian/
│   ├── views/          # UI rendering
│   └── controllers/    # Application flow coordination
├── tests/               # Test suite
└── docs/                # Documentation
```

## Technical Details

- **Pure JavaScript**: No external dependencies for the app itself
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Accessible**: Clean semantic HTML structure
- **Modular Code**: Easy to maintain and extend
- **Automated Testing**: Comprehensive test suite with Jest
- **CI/CD**: Automated testing on every commit

## Testing

The application includes a comprehensive test suite with 38 automated tests covering:
- Math operations (addition, subtraction, place value)
- Bulgarian language activities (letters, syllables, words)
- Navigation and state management

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

See [tests/README.md](tests/README.md) for detailed testing documentation.

## Development

### Setup
```bash
# Install dependencies
npm install

# Run tests
npm test
```

### Project Structure
```
lumi/
├── index.html           # Main HTML entry point
├── css/                 # Stylesheets
│   ├── base.css        # Base styles
│   └── themes/         # Theme-specific styles
├── js/                  # JavaScript source
│   ├── app.js          # Application entry point
│   ├── controllers/    # MVC Controllers
│   ├── models/         # MVC Models
│   │   └── extensions/ # Activity/Operation extensions
│   └── views/          # MVC Views
└── tests/              # Test suite
    ├── README.md       # Testing documentation
    ├── setup.js        # Test configuration
    └── *.test.js       # Test files
```

## Future Enhancements

The application is designed to easily support:
- Subtraction operations
- Multiplication tables
- Division problems
- Different UI themes
- Sound effects
- Progress tracking
- Parent dashboard

## Browser Support

Compatible with all modern browsers including:
- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+
