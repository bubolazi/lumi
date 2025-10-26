# Badge System Documentation

## Overview

Lumi features a dual badge system designed to encourage and reward children's learning progress:
1. **Visual Badges**: Awarded at specific milestone achievements
2. **Text Badges**: Random encouraging messages with animal names

## Visual Badge System

### Purpose
Visual badges provide tangible milestones for children to achieve, creating clear goals and celebrating significant progress.

### Badge Definitions

Visual badges are defined in `LocalizationModel` and include both Bulgarian and English translations:

| Icon | Bulgarian Name | English Name | Threshold | Description |
|------|---------------|--------------|-----------|-------------|
| 🌱 | Начинаещ | Novice | 5 | First milestone - encourages initial engagement |
| 📚 | Ученик | Learner | 10 | Early progress recognition |
| 🌟 | Постигач | Achiever | 20 | Significant commitment |
| ⭐ | Експерт | Expert | 50 | Advanced skill level |
| 🏆 | Майстор | Master | 100 | Ultimate achievement |

### Implementation

#### LocalizationModel
Visual badges are stored in the `VISUAL_BADGES` translation key:

```javascript
'VISUAL_BADGES': {
    'novice': {
        icon: '🌱',
        name: 'Начинаещ',
        description: 'Решени първите 5 задачи',
        threshold: 5
    },
    // ... more badges
}
```

Access via: `localization.getVisualBadges()`

#### Model Layer (MathModel, BulgarianLanguageModel)

The `checkBadge()` method returns an object with badge information:

```javascript
{
    type: 'visual',
    badge: {
        icon: '🌱',
        name: 'Начинаещ',
        description: 'Решени първите 5 задачи',
        threshold: 5
    }
}
```

Or for text badges:

```javascript
{
    type: 'text',
    message: 'Страхотна работа! Печелиш значка: Умна Лисица'
}
```

#### View Layer (AppView)

The `showVisualBadge()` method displays visual badges with special styling:

```javascript
showVisualBadge(badge) {
    // Creates HTML with icon, name, and description
    // Applies 'visual-badge' CSS class for enhanced styling
}
```

#### Controller Layer (AppController)

Handles badge display based on type:

```javascript
const badgeResult = this.model.checkBadge();
if (badgeResult) {
    if (badgeResult.type === 'visual') {
        this.view.showVisualBadge(badgeResult.badge);
    } else {
        this.view.showMessage(badgeResult.message, false);
    }
}
```

### UI/UX Design

Visual badges feature:
- **Large emoji icon** (4rem) with pulse animation
- **Bold uppercase name** (2rem) with letter spacing
- **Descriptive text** (1.2rem) explaining the achievement
- **Enhanced border and shadow** (3px solid with glow effect)
- **Centered layout** in a modal overlay

CSS classes:
- `.terminal-message.visual-badge` - Enhanced badge styling
- `.badge-content` - Flex column layout
- `.badge-icon` - Large animated icon
- `.badge-name` - Bold achievement title
- `.badge-description` - Explanatory text

### Animation

Badge icon uses `badgePulse` keyframe animation:
- Duration: 1 second
- Effect: Scales from 1.0 to 1.2 and back
- Timing: ease-in-out

## Text Badge System

### Purpose
Text badges provide frequent positive reinforcement between visual badge milestones, using grammatically correct Bulgarian animal + adjective combinations.

### Frequency
Awarded every 5 correct answers (when not at a visual badge milestone).

### Implementation

Text badges use gender-matched adjective + animal pairs from LocalizationModel:
- `BADGE_ANIMALS_NEUTER`, `BADGE_ANIMALS_FEMININE`, `BADGE_ANIMALS_MASCULINE`
- `BADGE_ADJECTIVES_NEUTER`, `BADGE_ADJECTIVES_FEMININE`, `BADGE_ADJECTIVES_MASCULINE`

Example output: "Страхотна работа! Печелиш значка: Умна Лисица"

### Generation Logic

```javascript
generateBadgeMessage() {
    // Randomly select gender category (neuter, feminine, masculine)
    // Get matching animals and adjectives for that gender
    // Combine with template message
    return `${template} ${adjective} ${animal}`;
}
```

## Badge Award Logic

### Priority System

The `checkBadge()` method checks in this order:

1. **Visual badge milestones** (5, 10, 20, 50, 100 total problems)
2. **Text badges** (every 5 in correctAnswersStreak)
3. **No badge** (return null)

### Streak Management

- `problemsSolved`: Total count, never resets, used for visual badges
- `correctAnswersStreak`: Count of consecutive correct answers, resets only after text badge awards

**Important**: Visual badges do NOT reset the streak. The streak continues accumulating through visual badge awards and only resets to 0 after a text badge is awarded. This allows both badge systems to operate independently.

## Testing

### Test Coverage

Comprehensive tests in `tests/visual-badges.test.js`:

#### Visual Badge Tests
- Awards at correct milestones (5, 10, 20, 50, 100)
- No awards between milestones
- Correct badge properties (icon, name, threshold)
- Works for both Math and Bulgarian Language subjects

#### LocalizationModel Tests
- Visual badges defined in both languages
- Correct structure and properties
- Proper threshold values

### Running Tests

```bash
npm test                  # Run all tests
npm test visual-badges   # Run only badge tests
```

## Adding New Visual Badges

To add a new visual badge:

1. **Add to LocalizationModel** in both `bg` and `en` sections:
```javascript
'VISUAL_BADGES': {
    // ... existing badges
    'new_badge': {
        icon: '🎯',
        name: 'Badge Name',
        description: 'Achievement description',
        threshold: 200
    }
}
```

2. **Update Model checkBadge() method**:
```javascript
if (visualBadges.new_badge && total === visualBadges.new_badge.threshold) {
    return { type: 'visual', badge: visualBadges.new_badge };
}
```

3. **Add tests** in `tests/visual-badges.test.js`:
```javascript
test('new badge awarded at 200 problems solved', () => {
    for (let i = 0; i < 200; i++) {
        mathModel.updateScore();
    }
    const badge = mathModel.checkBadge();
    expect(badge).not.toBeNull();
    expect(badge.type).toBe('visual');
    expect(badge.badge.icon).toBe('🎯');
});
```

## Customizing Text Badges

To modify text badge behavior:

### Change Frequency
Modify the modulo check in `checkBadge()`:
```javascript
// Currently every 5
if (this.correctAnswersStreak > 0 && this.correctAnswersStreak % 5 === 0)

// Example: Every 10
if (this.correctAnswersStreak > 0 && this.correctAnswersStreak % 10 === 0)
```

Note: The `correctAnswersStreak > 0` check prevents awarding badges when streak is 0.

### Add Animals/Adjectives
Add to the appropriate gender lists in LocalizationModel:
```javascript
'BADGE_ANIMALS_NEUTER': [
    // ... existing
    'Мече',  // New animal
],
'BADGE_ADJECTIVES_NEUTER': [
    // ... existing
    'Приятно',  // New adjective
]
```

## Future Enhancements

Potential improvements outlined in `docs/refactoring-analysis.md`:

### Phase 2: Badge Gallery
- Persistent badge collection
- View all earned badges
- Progress indicators
- Locked/unlocked states

### Phase 3: Advanced Features
- Badge persistence (localStorage)
- Shareable badge images
- Themed collections (seasonal, subject-specific)
- Challenge badges (speed, accuracy)
- Badge tiers (bronze/silver/gold)

## Architecture Notes

### Design Patterns
- **Strategy Pattern**: Different badge types (visual vs text) handled via type property
- **Localization**: All badge content centralized in LocalizationModel
- **Separation of Concerns**: Model determines awards, View displays, Controller coordinates

### Performance
- Badge checks are O(1) operations
- No DOM manipulation until badge earned
- Minimal memory footprint (definitions loaded once)

### Accessibility
- Emoji icons provide visual interest
- Text alternatives in badge names/descriptions
- High contrast green-on-black theme
- Large touch targets for mobile

## Related Files

- `js/models/core/LocalizationModel.js` - Badge definitions
- `js/models/subjects/math/MathModel.js` - Math badge logic
- `js/models/subjects/bulgarian/BulgarianLanguageModel.js` - Bulgarian badge logic
- `js/views/AppView.js` - Badge display
- `js/controllers/AppController.js` - Badge coordination
- `styles.css` - Badge styling and animation
- `tests/visual-badges.test.js` - Badge tests
