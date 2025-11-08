// Localization Model - Manages language translations
class LocalizationModel {
    constructor(language = 'bg') {
        this.currentLanguage = language;
        this.translations = this.getTranslations();
    }
    
    // Get all translations for different languages
    getTranslations() {
        return {
            'bg': {
                // Page title and header
                'MATH_TERMINAL': 'УЧЕБЕН ТЕРМИНАЛ v1.0',
                'LEVEL': 'НИВО',
                
                // Subjects
                'SELECT_SUBJECT': 'ИЗБЕРЕТЕ ПРЕДМЕТ:',
                'MATH_SUBJECT': 'МАТЕМАТИКА',
                'BULGARIAN_SUBJECT': 'БЪЛГАРСКИ ЕЗИК',
                'SUBJECT_INSTRUCTIONS': 'КЛИКНЕТЕ НА ПРЕДМЕТ ЗА ЗАПОЧВАНЕ • ОБНОВЕТЕ СТРАНИЦАТА ЗА ВРЪЩАНЕ ТУК',
                
                // Operations
                'ADDITION': 'СЪБИРАНЕ',
                'PLACE_VALUE': 'ЕДИНИЦИ И ДЕСЕТИЦИ',
                'SUBTRACTION': 'ИЗВАЖДАНЕ',
                'MULTIPLICATION': 'УМНОЖЕНИЕ',
                'DIVISION': 'ДЕЛЕНИЕ',
                
                // Bulgarian Language Activities
                'LETTERS': 'БУКВИ',
                'SYLLABLES': 'СРИЧКИ',
                'WORDS': 'ДУМИ',
                
                // Operation/Activity selection
                'SELECT_OPERATION': 'ИЗБЕРЕТЕ ДЕЙНОСТ:',
                'OPERATION_INSTRUCTIONS': 'КЛИКНЕТЕ НА ДЕЙНОСТ ЗА ЗАПОЧВАНЕ • ОБНОВЕТЕ СТРАНИЦАТА ЗА ВРЪЩАНЕ ТУК',
                
                // Level selection screen
                'SELECT_DIFFICULTY_LEVEL': 'ИЗБЕРЕТЕ НИВО НА ТРУДНОСТ:',
                // Math level descriptions
                'SINGLE_DIGITS': 'ЕДНОЦИФРЕНИ ЧИСЛА (1-9)',
                'DOUBLE_DIGITS': 'ДВУЦИФРЕНИ ЧИСЛА (10-19)',
                'UP_TO_20': 'ДО 20',
                'UP_TO_50': 'ДО 50',
                'UP_TO_100': 'ДО 100',
                
                // Place Value level descriptions
                'PLACE_VALUE_RECOGNITION': 'РАЗПОЗНАВАНЕ НА ЕДИНИЦИ И ДЕСЕТИЦИ',
                'PLACE_VALUE_CALCULATION': 'СТЪПКА ПО СТЪПКА СМЯТАНЕ',
                'WHICH_DIGIT_ONES': 'Коя цифра е в единиците?',
                'WHICH_DIGIT_TENS': 'Коя цифра е в десетиците?',
                'ONES_STEP': 'Първо: събери единиците',
                'CARRY_STEP': 'Второ: колко е преносът?',
                'TENS_STEP': 'Трето: събери десетиците',
                'COMBINE_STEP': 'Четвърто: комбинирай резултата',
                'STEP_ONES': 'Единици',
                'STEP_CARRY': 'Пренос',
                'STEP_TENS': 'Десетици',
                'STEP_COMBINE': 'Резултат',
                
                // Tooltips for Place Value
                'TOOLTIP_CARRY': 'Преносът е цифрата от десетиците когато сборът на единиците е 10 или повече. Например: 7 + 8 = 15, преносът е 1.',
                'TOOLTIP_ICON': '<i>i</i>',
                'TOOLTIP_HELP': 'Натиснете + за обяснение',
                'TOOLTIP_CLOSE': 'Натиснете + за затваряне',
                
                // Bulgarian Language level descriptions
                'VOWELS': 'ГЛАСНИ БУКВИ',
                'CONSONANTS': 'СЪГЛАСНИ БУКВИ',
                'ALL_LETTERS': 'ВСИЧКИ БУКВИ',
                'SIMPLE_SYLLABLES': 'ПРОСТИ СРИЧКИ',
                'COMPLEX_SYLLABLES': 'СЛОЖНИ СРИЧКИ',
                'ALL_SYLLABLES': 'ВСИЧКИ СРИЧКИ',
                'TWO_SYLLABLE_WORDS': 'ДВУСРИЧНИ ДУМИ',
                'THREE_SYLLABLE_WORDS': 'ТРИСРИЧНИ ДУМИ',
                'ALL_WORDS': 'ВСИЧКИ ДУМИ',
                
                'LEVEL_INSTRUCTIONS': 'КЛИКНЕТЕ НА НИВО ЗА ЗАПОЧВАНЕ • ОБНОВЕТЕ СТРАНИЦАТА ЗА ВРЪЩАНЕ ТУК',
                
                // Game screen
                'INPUT_PROMPT': '>',
                'SCORE': 'ТОЧКИ',
                'PROBLEMS': 'ЗАДАЧИ',
                'GAME_INSTRUCTIONS': 'ENTER = ПРАВИЛНО • DEL = ГРЕШНО • BACKSPACE = НАЗАД',
                'GAME_INSTRUCTIONS_MATH': 'НАТИСНЕТЕ ENTER ЗА ИЗПРАЩАНЕ НА ОТГОВОР • BACKSPACE = НАЗАД',
                
                // Reward messages
                'REWARD_MESSAGES': [
                    'ПРАВИЛНО! БРАВО!',
                    'ОТЛИЧНО ПРЕСМЯТАНЕ!',
                    'ПЕРФЕКТЕН ОТГОВОР!',
                    'НЕВЕРОЯТНА РАБОТА!',
                    'БЛЕСТЯЩ РЕЗУЛТАТ!',
                    'ПРЕВЪЗХОДНО ИЗЧИСЛЕНИЕ!',
                    'ИЗКЛЮЧИТЕЛНО УМЕНИЕ!',
                    'ВЕЛИКОЛЕПНА РАБОТА!',
                    'БЕЗУПРЕЧНО ИЗПЪЛНЕНИЕ!',
                    'ВПЕЧАТЛЯВАЩА ТОЧНОСТ!'
                ],
                
                // Subtraction-specific reward messages
                'SUBTRACTION_REWARD_MESSAGES': [
                    'ОТЛИЧНО ИЗВАЖДАНЕ!',
                    'ПЕРФЕКТНО ПРЕСМЯТАНЕ!',
                    'НЕВЕРОЯТНА РАБОТА С ИЗВАЖДАНЕ!',
                    'БЛЕСТЯЩИ УМЕНИЯ ЗА МИНУС!',
                    'ПРЕВЪЗХОДНО ИЗВАЖДАНЕ!',
                    'БЕЗУПРЕЧНО ИЗВАЖДАНЕ!',
                    'ВЕЛИКОЛЕПНО ИЗВАЖДАНЕ!',
                    'ВПЕЧАТЛЯВАЩА РАБОТА С МИНУС!',
                    'ИЗКЛЮЧИТЕЛНО ИЗВАЖДАНЕ!',
                    'НЕВЕРОЯТНИ УМЕНИЯ ЗА ИЗВАЖДАНЕ!'
                ],
                
                // Place Value reward messages
                'PLACE_VALUE_REWARD_MESSAGES': [
                    'ОТЛИЧНО! ПОЗНАВАШ ЕДИНИЦИТЕ И ДЕСЕТИЦИТЕ!',
                    'ПЕРФЕКТНО РАЗБИРАНЕ!',
                    'НЕВЕРОЯТНА РАБОТА!',
                    'БЛЕСТЯЩО ПОЗНАВАНЕ НА ПОЗИЦИИТЕ!',
                    'ПРЕВЪЗХОДНО!',
                    'БЕЗУПРЕЧНО РАЗПОЗНАВАНЕ!',
                    'ВЕЛИКОЛЕПНА РАБОТА!',
                    'ВПЕЧАТЛЯВАЩО!',
                    'ИЗКЛЮЧИТЕЛНО!',
                    'ЧУДЕСНО РАЗБИРАНЕ НА ЧИСЛАТА!'
                ],
                
                // Bulgarian Language reward messages
                'BULGARIAN_REWARD_MESSAGES': [
                    'БРАВО! ОТЛИЧНО ЧЕТЕНЕ!',
                    'ПЕРФЕКТНО ПРОЧЕТЕНА!',
                    'НЕВЕРОЯТНА РАБОТА!',
                    'БЛЕСТЯЩО ЧЕТЕНЕ!',
                    'ПРЕВЪЗХОДНО!',
                    'БЕЗУПРЕЧНО ПРОЧЕТЕНО!',
                    'ВЕЛИКОЛЕПНА РАБОТА!',
                    'ВПЕЧАТЛЯВАЩО ЧЕТЕНЕ!',
                    'ИЗКЛЮЧИТЕЛНО УМЕНИЕ!',
                    'ЧУДЕСНО ПРОЧЕТЕНО!'
                ],
                
                // Badge system - Animals organized by gender
                // Среден род (neuter) - ends in -о, -е
                'BADGE_ANIMALS_NEUTER': [
                    'Мече',
                    'Зайче',
                    'Котенце',
                    'Кученце',
                    'Лисиче',
                    'Тигърче',
                    'Слонче',
                    'Жирафче',
                    'Пиленце',
                    'Патенце',
                    'Морско Конче',
                    'Бухалче',
                    'Папагалче'
                ],
                
                // Женски род (feminine) - ends in -а, -я
                'BADGE_ANIMALS_FEMININE': [
                    'Катеричка',
                    'Коала',
                    'Панда',
                    'Овчица',
                    'Пеперудка',
                    'Калинка',
                    'Рибка',
                    'Костенурка',
                    'Мравка',
                    'Пчеличка'
                ],
                
                // Мъжки род (masculine) - ends in consonant
                'BADGE_ANIMALS_MASCULINE': [
                    'Пеликан',
                    'Делфин',
                    'Пингвин',
                    'Хамстер',
                    'Октопод'
                ],
                
                // Badge system - Adjectives organized by gender
                // Среден род (neuter) - ends in -о, -е
                'BADGE_ADJECTIVES_NEUTER': [
                    'Слънчево',
                    'Усмихнато',
                    'Щастливо',
                    'Весело',
                    'Умно',
                    'Златно',
                    'Сребърно',
                    'Танцуващо',
                    'Радостно',
                    'Блестящо',
                    'Смело',
                    'Любопитно',
                    'Игриво',
                    'Храбро',
                    'Енергично',
                    'Мило',
                    'Вълшебно',
                    'Искрящо',
                    'Светло',
                    'Топло',
                    'Нежно',
                    'Приятелско',
                    'Усърдно',
                    'Шарено',
                    'Звездно',
                    'Мечтано',
                    'Прекрасно',
                    'Чудесно'
                ],
                
                // Женски род (feminine) - ends in -а, -я
                'BADGE_ADJECTIVES_FEMININE': [
                    'Слънчева',
                    'Усмихната',
                    'Щастлива',
                    'Весела',
                    'Умна',
                    'Златна',
                    'Сребърна',
                    'Танцуваща',
                    'Радостна',
                    'Блестяща',
                    'Смела',
                    'Любопитна',
                    'Игрива',
                    'Храбра',
                    'Енергична',
                    'Мила',
                    'Вълшебна',
                    'Искряща',
                    'Светла',
                    'Топла',
                    'Нежна',
                    'Приятелска',
                    'Усърдна',
                    'Шарена',
                    'Звездна',
                    'Мечтана',
                    'Прекрасна',
                    'Чудесна'
                ],
                
                // Мъжки род (masculine) - ends in consonant
                'BADGE_ADJECTIVES_MASCULINE': [
                    'Слънчев',
                    'Усмихнат',
                    'Щастлив',
                    'Весел',
                    'Умен',
                    'Златен',
                    'Сребърен',
                    'Танцуващ',
                    'Радостен',
                    'Блестящ',
                    'Смел',
                    'Любопитен',
                    'Игрив',
                    'Храбър',
                    'Енергичен',
                    'Мил',
                    'Вълшебен',
                    'Искрящ',
                    'Светъл',
                    'Топъл',
                    'Нежен',
                    'Приятелски',
                    'Усърден',
                    'Шарен',
                    'Звезден',
                    'Мечтан',
                    'Прекрасен',
                    'Чудесен'
                ],
                
                // Badge message template
                'BADGE_MESSAGE': 'Страхотна работа! Печелиш значка:',
                
                // Error messages
                'ERROR_INVALID_INPUT': 'ГРЕШКА: НЕВАЛИДЕН ВХОД',
                'INCORRECT_ANSWER': 'НЕПРАВИЛНО. ОТГОВОР:',
                'INCORRECT_ANSWER_BULGARIAN': 'ОПИТАЙ ПАК!'
            },
            
            // Keep English as fallback
            'en': {
                'MATH_TERMINAL': 'MATH TERMINAL v1.0',
                'LEVEL': 'LEVEL',
                'ADDITION': 'ADDITION',
                'SELECT_DIFFICULTY_LEVEL': 'SELECT DIFFICULTY LEVEL:',
                'SINGLE_DIGITS': 'SINGLE DIGITS (1-9)',
                'DOUBLE_DIGITS': 'DOUBLE DIGITS (10-19)',
                'UP_TO_20': 'UP TO 20',
                'UP_TO_50': 'UP TO 50',
                'UP_TO_100': 'UP TO 100',
                'LEVEL_INSTRUCTIONS': 'CLICK ON A LEVEL TO START • REFRESH PAGE TO RETURN HERE',
                'INPUT_PROMPT': '>',
                'SCORE': 'SCORE',
                'PROBLEMS': 'PROBLEMS',
                'GAME_INSTRUCTIONS': 'PRESS ENTER TO SUBMIT ANSWER • REFRESH PAGE TO RETURN TO LEVELS',
                'REWARD_MESSAGES': [
                    'CORRECT! WELL DONE!',
                    'EXCELLENT CALCULATION!',
                    'PERFECT ANSWER!',
                    'OUTSTANDING WORK!',
                    'BRILLIANT RESULT!',
                    'SUPERB COMPUTATION!',
                    'EXCEPTIONAL SKILL!',
                    'MAGNIFICENT WORK!',
                    'FLAWLESS EXECUTION!',
                    'IMPRESSIVE ACCURACY!'
                ],
                // English doesn't have grammatical gender, so we use single lists
                'BADGE_ANIMALS_NEUTER': [
                    'Bear Cub',
                    'Bunny',
                    'Kitten',
                    'Puppy',
                    'Fox Cub',
                    'Tiger Cub',
                    'Elephant',
                    'Giraffe',
                    'Chick',
                    'Duckling',
                    'Seahorse',
                    'Owlet',
                    'Parrot'
                ],
                'BADGE_ANIMALS_FEMININE': [
                    'Squirrel',
                    'Koala',
                    'Panda',
                    'Sheep',
                    'Butterfly',
                    'Ladybug',
                    'Fish',
                    'Turtle',
                    'Ant',
                    'Bee'
                ],
                'BADGE_ANIMALS_MASCULINE': [
                    'Pelican',
                    'Dolphin',
                    'Penguin',
                    'Hamster',
                    'Octopus'
                ],
                'BADGE_ADJECTIVES_NEUTER': [
                    'Sunny',
                    'Smiling',
                    'Happy',
                    'Cheerful',
                    'Smart',
                    'Golden',
                    'Silver',
                    'Dancing',
                    'Joyful',
                    'Brilliant',
                    'Brave',
                    'Curious',
                    'Playful',
                    'Courageous',
                    'Energetic',
                    'Sweet',
                    'Magical',
                    'Sparkling',
                    'Bright',
                    'Warm',
                    'Gentle',
                    'Friendly',
                    'Diligent',
                    'Colorful',
                    'Starry',
                    'Dreamy',
                    'Wonderful',
                    'Amazing'
                ],
                'BADGE_ADJECTIVES_FEMININE': [
                    'Sunny',
                    'Smiling',
                    'Happy',
                    'Cheerful',
                    'Smart',
                    'Golden',
                    'Silver',
                    'Dancing',
                    'Joyful',
                    'Brilliant',
                    'Brave',
                    'Curious',
                    'Playful',
                    'Courageous',
                    'Energetic',
                    'Sweet',
                    'Magical',
                    'Sparkling',
                    'Bright',
                    'Warm',
                    'Gentle',
                    'Friendly',
                    'Diligent',
                    'Colorful',
                    'Starry',
                    'Dreamy',
                    'Wonderful',
                    'Amazing'
                ],
                'BADGE_ADJECTIVES_MASCULINE': [
                    'Sunny',
                    'Smiling',
                    'Happy',
                    'Cheerful',
                    'Smart',
                    'Golden',
                    'Silver',
                    'Dancing',
                    'Joyful',
                    'Brilliant',
                    'Brave',
                    'Curious',
                    'Playful',
                    'Courageous',
                    'Energetic',
                    'Sweet',
                    'Magical',
                    'Sparkling',
                    'Bright',
                    'Warm',
                    'Gentle',
                    'Friendly',
                    'Diligent',
                    'Colorful',
                    'Starry',
                    'Dreamy',
                    'Wonderful',
                    'Amazing'
                ],
                'BADGE_MESSAGE': 'Great work! You earned a badge:',
                'ERROR_INVALID_INPUT': 'ERROR: INVALID INPUT',
                'INCORRECT_ANSWER': 'INCORRECT. ANSWER:'
            }
        };
    }
    
    // Get translation for a key
    t(key) {
        const translations = this.translations[this.currentLanguage];
        if (translations && translations[key]) {
            return translations[key];
        }
        
        // Fallback to English if key not found in current language
        const englishTranslations = this.translations['en'];
        if (englishTranslations && englishTranslations[key]) {
            return englishTranslations[key];
        }
        
        // Return key itself if no translation found
        console.warn(`Translation not found for key: ${key}`);
        return key;
    }
    
    // Get array translation (like reward messages)
    tArray(key) {
        const translation = this.t(key);
        return Array.isArray(translation) ? translation : [translation];
    }
    
    // Change language
    setLanguage(language) {
        if (this.translations[language]) {
            this.currentLanguage = language;
            return true;
        }
        return false;
    }
    
    // Get current language
    getCurrentLanguage() {
        return this.currentLanguage;
    }
    
    // Get available languages
    getAvailableLanguages() {
        return Object.keys(this.translations);
    }
}