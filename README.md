# Learning Practice for Kids

A beautiful, kid-friendly web application for preschool children to learn and practice various subjects including math and language. Features a green monochrome theme and progressive difficulty levels.

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

**Place Value (Ones & Tens):**
- **Level 1**: Recognition of ones and tens digits
- **Level 2**: Step-by-step calculation with visual history

### 🧮 Multi-Step Calculation Process
- **Visual Calculation History**: All completed steps remain visible on screen
- **Step-by-Step Guidance**: Clear progression through complex calculations
- **Number-Focused Design**: Digits and numbers are the main visual accent
- **Compact Information**: Concise labels with tooltips for detailed explanations
- **Progressive Indicators**: Emoji-based step markers for easy tracking:
  - 📝 Initial problem statement
  - 1️⃣ Step 1: Calculate ones place
  - 2️⃣ Step 2: Determine carry-over
  - 3️⃣ Step 3: Calculate tens place
  - 4️⃣ Step 4: Combine final result

### 🎉 Reward System
- Animated reward messages for correct answers
- Automatic progression to next problems
- Score tracking and problem counter
- Encouraging feedback messages

### 🚀 Easy to Extend
The application is built with a modular architecture that makes it easy to add:
- New subjects (e.g., science, history)
- Additional activities within subjects
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
- **Multi-Step UI**: Dynamic history display for complex calculations
- **Adaptive Layout**: Switches between standard and multi-step views automatically

## Testing

The application includes a comprehensive test suite with 120 automated tests covering:
- User storage and data persistence (localStorage + Supabase)
- Supabase integration and fallback mechanisms
- Data migration utilities
- Math operations (addition, subtraction, place value)
- Bulgarian language activities (letters, syllables, words)
- Navigation and state management
- Input handling and validation

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

## Database Integration

The application supports both **localStorage** (default) and **Supabase** (cloud database) for data persistence.

### Current Status: ✅ Implementation Complete

The hybrid storage architecture is fully implemented and tested:
- ✅ Supabase client integration with CDN
- ✅ Hybrid storage model (Supabase + localStorage fallback)
- ✅ User management and badge tracking
- ✅ Data migration utility
- ✅ Comprehensive test suite (120 tests passing)
- ✅ Graceful fallback on network errors

### Using localStorage (Default)

By default, the application uses localStorage for data persistence. No configuration required - it just works!

### Enabling Supabase

To enable cloud synchronization with Supabase:

1. **Create a Supabase project** at [supabase.com](https://supabase.com) (free tier available)

2. **Execute the database schema**:
   - Copy the contents of `docs/supabase-schema.sql`
   - Run it in your Supabase SQL Editor

3. **Configure credentials** in `js/config/SupabaseConfig.js`:
   ```javascript
   this.supabaseUrl = 'YOUR_SUPABASE_PROJECT_URL';
   this.supabaseAnonKey = 'YOUR_SUPABASE_ANON_KEY';
   this.enabled = true;
   ```

4. **Reload the application** - it will automatically use Supabase!

### Documentation

- 📖 **[Full Integration Guide](docs/SUPABASE_INTEGRATION_GUIDE.md)** - Complete implementation details
- 🚀 **[Quick Start Guide](docs/SUPABASE_QUICK_START.md)** - Setup in 30 minutes
- 🗄️ **[Database Schema](docs/supabase-schema.sql)** - Ready-to-execute SQL
- 📋 **[Implementation Summary](docs/SUPABASE_IMPLEMENTATION_SUMMARY.md)** - Architecture overview

### Benefits

- ✅ **Cross-device sync**: Access your data from any device
- ✅ **Cross-browser**: Switch browsers, keep your progress
- ✅ **Cloud backup**: Never lose your data
- ✅ **Fallback support**: Works offline with localStorage
- ✅ **Future-ready**: Foundation for leaderboards, social features
- ✅ **Zero config**: Works with localStorage by default

### Security

The Supabase `anon` (public) key is safe to commit and expose in client-side code:
- 🔒 Protected by Row Level Security (RLS) policies at database level
- 🔒 Rate limited by Supabase to prevent abuse
- 🔒 Cannot access or modify data beyond RLS policy permissions

**Never commit the `service_role` key** - use it only in server environments!

## Future Enhancements

The application is designed to easily support:
- Additional math operations (multiplication, division)
- More language subjects
- Science and other subjects
- Different UI themes
- Sound effects
- Advanced progress tracking with analytics
- Parent dashboard
- Leaderboards and social features
- Multi-user collaboration

## Browser Support

Compatible with all modern browsers including:
- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+
