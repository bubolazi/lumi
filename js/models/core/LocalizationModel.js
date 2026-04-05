class LocalizationModel {
    constructor(language = 'en') {
        this.currentLanguage = language;
        this.translations = this.getTranslations();
    }

    getTranslations() {
        return {
            'bg': {
                'MATH_TERMINAL': 'УЧЕБЕН ТЕРМИНАЛ v0.1',
                'LEVEL': 'НИВО',

                'SELECT_SUBJECT': 'ИЗБЕРЕТЕ ПРЕДМЕТ:',
                'MATH_SUBJECT': 'МАТЕМАТИКА',
                'BULGARIAN_SUBJECT': 'БЪЛГАРСКИ ЕЗИК',
                'SUBJECT_INSTRUCTIONS': 'ИЗБЕРЕТЕ НОМЕР НА ПРЕДМЕТ • BACKSPACE = НАЗАД',

                'ADDITION': 'СЪБИРАНЕ',
                'PLACE_VALUE': 'ЕДИНИЦИ И ДЕСЕТИЦИ',
                'SUBTRACTION': 'ИЗВАЖДАНЕ',
                'MULTIPLICATION': 'УМНОЖЕНИЕ',
                'DIVISION': 'ДЕЛЕНИЕ',

                'LETTERS': 'БУКВИ',
                'SYLLABLES': 'СРИЧКИ',
                'WORDS': 'ДУМИ',

                'SELECT_OPERATION': 'ИЗБЕРЕТЕ ДЕЙНОСТ:',
                'OPERATION_INSTRUCTIONS': 'ИЗБЕРЕТЕ НОМЕР НА ДЕЙНОСТ • BACKSPACE = НАЗАД',

                'SELECT_DIFFICULTY_LEVEL': 'ИЗБЕРЕТЕ НИВО НА ТРУДНОСТ:',
                'SINGLE_DIGITS': 'ЕДНОЦИФРЕНИ ЧИСЛА (1-9)',
                'DOUBLE_DIGITS': 'ДВУЦИФРЕНИ ЧИСЛА (10-19)',
                'UP_TO_20': 'ДО 20',
                'UP_TO_50': 'ДО 50',
                'UP_TO_100': 'ДО 100',

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

                'STEP_DESC_ONES': 'Изчисляване на единици',
                'STEP_DESC_CARRY': 'Определяне на пренос',
                'STEP_DESC_TENS': 'Изчисляване на десетици',
                'STEP_DESC_COMBINE': 'Комбиниране на резултата',

                'STEP_DESC_ONES_SUB': 'Изчисляване на единици',
                'STEP_DESC_BORROW': 'Определяне на заемане',
                'STEP_DESC_TENS_SUB': 'Изчисляване на десетици',
                'STEP_DESC_COMBINE_SUB': 'Комбиниране на резултата',

                'TOOLTIP_CARRY': 'Преносът е цифрата от десетиците когато сборът на единиците е 10 или повече. Например: 7 + 8 = 15, преносът е 1.',
                'TOOLTIP_BORROW': 'Заемането е когато трябва да вземем 1 десетица и да я превърнем в 10 единици. Например: 32 - 18, заемаме 1 десетица за единиците.',
                'TOOLTIP_ICON': '<i>i</i>',
                'TOOLTIP_HELP': 'Натиснете + за обяснение',
                'TOOLTIP_CLOSE': 'Натиснете + за затваряне',

                'LETTER_RECOGNITION_EMOJI': 'БУКВИ С КАРТИНКИ',
                'VOWELS': 'ГЛАСНИ БУКВИ',
                'CONSONANTS': 'СЪГЛАСНИ БУКВИ',
                'ALL_LETTERS': 'ВСИЧКИ БУКВИ',
                'SIMPLE_SYLLABLES': 'ПРОСТИ СРИЧКИ',
                'COMPLEX_SYLLABLES': 'СЛОЖНИ СРИЧКИ',
                'ALL_SYLLABLES': 'ВСИЧКИ СРИЧКИ',
                'TWO_SYLLABLE_WORDS': 'ДВУСРИЧНИ ДУМИ',
                'THREE_SYLLABLE_WORDS': 'ТРИСРИЧНИ ДУМИ',
                'ALL_WORDS': 'ВСИЧКИ ДУМИ',

                'LEVEL_INSTRUCTIONS': 'ИЗБЕРЕТЕ НОМЕР НА НИВО • BACKSPACE = НАЗАД',

                'INPUT_PROMPT': '>',
                'SCORE': 'ТОЧКИ',
                'PROBLEMS': 'ЗАДАЧИ',
                'GAME_INSTRUCTIONS': 'ENTER = ПРАВИЛНО • DEL = ГРЕШНО • BACKSPACE = НАЗАД',
                'GAME_INSTRUCTIONS_MATH': 'НАТИСНЕТЕ ENTER ЗА ИЗПРАЩАНЕ НА ОТГОВОР • BACKSPACE = НАЗАД',

                'STEP_CORRECT_NEXT': 'ПРАВИЛНО! Следваща стъпка...',

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

                'BADGE_ANIMALS_MASCULINE': [
                    'Пеликан',
                    'Делфин',
                    'Пингвин',
                    'Хамстер',
                    'Октопод'
                ],

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

                'BADGE_MESSAGE': 'Печелиш значка',

                'BADGE_ANIMAL_EMOJIS': {
                    'Мече': '🐻',
                    'Зайче': '🐰',
                    'Котенце': '🐱',
                    'Кученце': '🐶',
                    'Лисиче': '🦊',
                    'Тигърче': '🐯',
                    'Слонче': '🐘',
                    'Жирафче': '🦒',
                    'Пиленце': '🐥',
                    'Патенце': '🦆',
                    'Морско Конче': '🐴',
                    'Бухалче': '🦉',
                    'Папагалче': '🦜',
                    'Катеричка': '🐿️',
                    'Коала': '🐨',
                    'Панда': '🐼',
                    'Овчица': '🐑',
                    'Пеперудка': '🦋',
                    'Калинка': '🐞',
                    'Рибка': '🐠',
                    'Костенурка': '🐢',
                    'Мравка': '🐜',
                    'Пчеличка': '🐝',
                    'Пеликан': '🦩',
                    'Делфин': '🐬',
                    'Пингвин': '🐧',
                    'Хамстер': '🐹',
                    'Октопод': '🐙'
                },

                'FEEDBACK_CORRECT': 'ПРАВИЛНО!',
                'FEEDBACK_INCORRECT': 'НЕПРАВИЛНО',
                'FEEDBACK_WRONG_EMOJI': '❌',

                'USER_PROMPT': 'Въведи твоето име:',
                'USER_LOGGED_IN': 'Потребител:',
                'LOGOUT': 'ИЗХОД',
                'BADGES_TITLE': 'ЗНАЧКИ',
                'BADGES_COUNT': 'Брой значки:',
                'BADGES_HELP': '* = ПОКАЖИ ЗНАЧКИ',
                'NO_BADGES': 'Все още нямаш значки. Спечели 5 точни отговора за първата си значка!',
                'BADGES_PAGE': 'Значки {current} - {end} от {total}',
                'BADGES_PRESS_STAR': 'Натисни * за следващи значки',
                'BADGES_CLOSE': 'Натисни * за затваряне',

                'ERROR_INVALID_INPUT': 'ГРЕШКА: НЕВАЛИДЕН ВХОД',
                'INCORRECT_ANSWER': 'НЕПРАВИЛНО. ОТГОВОР:',
                'INCORRECT_ANSWER_BULGARIAN': 'ОПИТАЙ ПАК!'
            },

            'en': {
                'MATH_TERMINAL': 'LEARNING TERMINAL v0.1',
                'LEVEL': 'LEVEL',

                'SELECT_SUBJECT': 'SELECT SUBJECT:',
                'MATH_SUBJECT': 'MATHEMATICS',
                'BULGARIAN_SUBJECT': 'BULGARIAN LANGUAGE',
                'SUBJECT_INSTRUCTIONS': 'SELECT SUBJECT NUMBER • BACKSPACE = BACK',

                'ADDITION': 'ADDITION',
                'PLACE_VALUE': 'ONES AND TENS',
                'SUBTRACTION': 'SUBTRACTION',
                'MULTIPLICATION': 'MULTIPLICATION',
                'DIVISION': 'DIVISION',

                'LETTERS': 'LETTERS',
                'SYLLABLES': 'SYLLABLES',
                'WORDS': 'WORDS',

                'SELECT_OPERATION': 'SELECT ACTIVITY:',
                'OPERATION_INSTRUCTIONS': 'SELECT ACTIVITY NUMBER • BACKSPACE = BACK',

                'SELECT_DIFFICULTY_LEVEL': 'SELECT DIFFICULTY LEVEL:',
                'SINGLE_DIGITS': 'SINGLE DIGITS (1-9)',
                'DOUBLE_DIGITS': 'DOUBLE DIGITS (10-19)',
                'UP_TO_20': 'UP TO 20',
                'UP_TO_50': 'UP TO 50',
                'UP_TO_100': 'UP TO 100',

                'PLACE_VALUE_RECOGNITION': 'ONES AND TENS RECOGNITION',
                'PLACE_VALUE_CALCULATION': 'STEP-BY-STEP CALCULATION',
                'WHICH_DIGIT_ONES': 'Which digit is in the ones place?',
                'WHICH_DIGIT_TENS': 'Which digit is in the tens place?',
                'ONES_STEP': 'First: add the ones',
                'CARRY_STEP': 'Second: what is the carry?',
                'TENS_STEP': 'Third: add the tens',
                'COMBINE_STEP': 'Fourth: combine the result',
                'STEP_ONES': 'Ones',
                'STEP_CARRY': 'Carry',
                'STEP_TENS': 'Tens',
                'STEP_COMBINE': 'Result',

                'STEP_DESC_ONES': 'Calculate ones',
                'STEP_DESC_CARRY': 'Determine carry',
                'STEP_DESC_TENS': 'Calculate tens',
                'STEP_DESC_COMBINE': 'Combine the result',

                'STEP_DESC_ONES_SUB': 'Calculate ones',
                'STEP_DESC_BORROW': 'Determine borrow',
                'STEP_DESC_TENS_SUB': 'Calculate tens',
                'STEP_DESC_COMBINE_SUB': 'Combine the result',

                'TOOLTIP_CARRY': 'The carry is the tens digit when the sum of the ones is 10 or more. For example: 7 + 8 = 15, the carry is 1.',
                'TOOLTIP_BORROW': 'Borrowing is when we need to take 1 ten and convert it into 10 ones. For example: 32 - 18, we borrow 1 ten for the ones.',
                'TOOLTIP_ICON': '<i>i</i>',
                'TOOLTIP_HELP': 'Press + for explanation',
                'TOOLTIP_CLOSE': 'Press + to close',

                'LETTER_RECOGNITION_EMOJI': 'LETTERS WITH PICTURES',
                'VOWELS': 'VOWELS',
                'CONSONANTS': 'CONSONANTS',
                'ALL_LETTERS': 'ALL LETTERS',
                'SIMPLE_SYLLABLES': 'SIMPLE SYLLABLES',
                'COMPLEX_SYLLABLES': 'COMPLEX SYLLABLES',
                'ALL_SYLLABLES': 'ALL SYLLABLES',
                'TWO_SYLLABLE_WORDS': 'TWO-SYLLABLE WORDS',
                'THREE_SYLLABLE_WORDS': 'THREE-SYLLABLE WORDS',
                'ALL_WORDS': 'ALL WORDS',

                'LEVEL_INSTRUCTIONS': 'SELECT LEVEL NUMBER • BACKSPACE = BACK',

                'INPUT_PROMPT': '>',
                'SCORE': 'SCORE',
                'PROBLEMS': 'PROBLEMS',
                'GAME_INSTRUCTIONS': 'ENTER = CORRECT • DEL = WRONG • BACKSPACE = BACK',
                'GAME_INSTRUCTIONS_MATH': 'PRESS ENTER TO SUBMIT ANSWER • BACKSPACE = BACK',

                'STEP_CORRECT_NEXT': 'CORRECT! Next step...',

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

                'SUBTRACTION_REWARD_MESSAGES': [
                    'EXCELLENT SUBTRACTION!',
                    'PERFECT CALCULATION!',
                    'OUTSTANDING SUBTRACTION WORK!',
                    'BRILLIANT MINUS SKILLS!',
                    'SUPERB SUBTRACTION!',
                    'FLAWLESS SUBTRACTION!',
                    'MAGNIFICENT SUBTRACTION!',
                    'IMPRESSIVE MINUS WORK!',
                    'EXCEPTIONAL SUBTRACTION!',
                    'INCREDIBLE SUBTRACTION SKILLS!'
                ],

                'PLACE_VALUE_REWARD_MESSAGES': [
                    'EXCELLENT! YOU KNOW YOUR ONES AND TENS!',
                    'PERFECT UNDERSTANDING!',
                    'OUTSTANDING WORK!',
                    'BRILLIANT PLACE VALUE KNOWLEDGE!',
                    'SUPERB!',
                    'FLAWLESS RECOGNITION!',
                    'MAGNIFICENT WORK!',
                    'IMPRESSIVE!',
                    'EXCEPTIONAL!',
                    'WONDERFUL NUMBER UNDERSTANDING!'
                ],

                'BULGARIAN_REWARD_MESSAGES': [
                    'BRAVO! EXCELLENT READING!',
                    'PERFECTLY READ!',
                    'OUTSTANDING WORK!',
                    'BRILLIANT READING!',
                    'SUPERB!',
                    'FLAWLESSLY READ!',
                    'MAGNIFICENT WORK!',
                    'IMPRESSIVE READING!',
                    'EXCEPTIONAL SKILL!',
                    'WONDERFULLY READ!'
                ],

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

                'BADGE_MESSAGE': 'You earned a badge:',

                'BADGE_ANIMAL_EMOJIS': {
                    'Bear Cub': '🐻',
                    'Bunny': '🐰',
                    'Kitten': '🐱',
                    'Puppy': '🐶',
                    'Fox Cub': '🦊',
                    'Tiger Cub': '🐯',
                    'Elephant': '🐘',
                    'Giraffe': '🦒',
                    'Chick': '🐥',
                    'Duckling': '🦆',
                    'Seahorse': '🐴',
                    'Owlet': '🦉',
                    'Parrot': '🦜',
                    'Squirrel': '🐿️',
                    'Koala': '🐨',
                    'Panda': '🐼',
                    'Sheep': '🐑',
                    'Butterfly': '🦋',
                    'Ladybug': '🐞',
                    'Fish': '🐠',
                    'Turtle': '🐢',
                    'Ant': '🐜',
                    'Bee': '🐝',
                    'Pelican': '🦩',
                    'Dolphin': '🐬',
                    'Penguin': '🐧',
                    'Hamster': '🐹',
                    'Octopus': '🐙'
                },

                'FEEDBACK_CORRECT': 'CORRECT!',
                'FEEDBACK_INCORRECT': 'INCORRECT',
                'FEEDBACK_WRONG_EMOJI': '❌',

                'USER_PROMPT': 'Enter your name:',
                'USER_LOGGED_IN': 'User:',
                'LOGOUT': 'LOGOUT',
                'BADGES_TITLE': 'BADGES',
                'BADGES_COUNT': 'Badge count:',
                'BADGES_HELP': '* = SHOW BADGES',
                'NO_BADGES': 'No badges yet. Get 5 correct answers to earn your first badge!',
                'BADGES_PAGE': 'Badges {current} - {end} of {total}',
                'BADGES_PRESS_STAR': 'Press * for next badges',
                'BADGES_CLOSE': 'Press * to close',

                'ERROR_INVALID_INPUT': 'ERROR: INVALID INPUT',
                'INCORRECT_ANSWER': 'INCORRECT. ANSWER:',
                'INCORRECT_ANSWER_BULGARIAN': 'TRY AGAIN!'
            }
        };
    }

    t(key) {
        const translations = this.translations[this.currentLanguage];
        if (translations && translations[key]) {
            return translations[key];
        }

        const englishTranslations = this.translations['en'];
        if (englishTranslations && englishTranslations[key]) {
            return englishTranslations[key];
        }

        console.warn(`Translation not found for key: ${key}`);
        return key;
    }

    tArray(key) {
        const translation = this.t(key);
        return Array.isArray(translation) ? translation : [translation];
    }

    setLanguage(language) {
        if (this.translations[language]) {
            this.currentLanguage = language;
            return true;
        }
        return false;
    }

    getCurrentLanguage() {
        return this.currentLanguage;
    }

    getAvailableLanguages() {
        return Object.keys(this.translations);
    }

    persistLocale() {
        localStorage.setItem('lumi_locale', this.currentLanguage);
    }

    getBadgeEmoji(animalName) {
        const emojiMap = this.t('BADGE_ANIMAL_EMOJIS');
        if (emojiMap && typeof emojiMap === 'object') {
            return emojiMap[animalName] || '⭐';
        }
        return '⭐';
    }

    extractAnimalFromBadge(badgeName) {
        const emojiMap = this.t('BADGE_ANIMAL_EMOJIS');
        if (emojiMap && typeof emojiMap === 'object') {
            const animalKey = Object.keys(emojiMap).find(key => badgeName.endsWith(key));
            if (animalKey) return animalKey;
        }
        const words = badgeName.trim().split(' ');
        return words[words.length - 1];
    }
}
