// Extension: Letters Activity - Bulgarian alphabet learning
class LettersActivity {
    static getLevels() {
        return {
            1: { descriptionKey: 'LETTER_RECOGNITION_EMOJI' },
            2: { descriptionKey: 'VOWELS' },
            3: { descriptionKey: 'CONSONANTS' },
            4: { descriptionKey: 'ALL_LETTERS' }
        };
    }

    static getLetterEmojiMap() {
        return {
            'А': ['🚗', '🚌', '🍍', '🦈'],
            'Б': ['🍌', '🎈', '🍪', '🥁', '👵', '🦉', '🏨'],
            'В': ['🐺', '🌊', '🚂', '🚲', '🚪', '🚁'],
            'Г': ['🍄', '🪿', '🍇', '🕊️'],
            'Д': ['🌳', '🦕', '🍉', '🍅', '🐬'],
            'Е': ['🦌', '🦄', '🏞️', '🏷️'],
            'Ж': ['🐸', '🦒', '🟡', '🎫'],
            'З': ['🐰', '🦷', '⭐', '🐍', '🥬', '🦓', '🔔'],
            'И': ['🧸', '🦎', '💉', '🏨', '🎣'],
            'Й': ['🪀', '🧘'],
            'К': ['🐱', '🧁', '🐶', '🐢', '🔑', '👑', '🌵', '🐿️', '🐞', '🏠'],
            'Л': ['🦁', '🍋', '🦊', '🌷', '🌙', '🦢', '🥄', '🚑'],
            'М': ['🐻', '🍯', '🐭', '🏍️', '🥕', '🌩️', '🐵'],
            'Н': ['👃', '✂️', '🦏', '🌃', '🎵'],
            'О': ['👁️', '🔥', '🐌', '🐑', '👓', '👠', '🦅', '☁️'],
            'П': ['🐧', '🦜', '🎁', '🦋', '🍊', '🍕', '🕸️', '🐼', '🍆', '🦇'],
            'Р': ['🐟', '🌹', '🤚', '🪴', '🦀', '🚀', '🤖'],
            'С': ['☀️', '🐘', '🍦', '❄️', '⛄', '🧀'],
            'Т': ['🐯', '🍰', '🦔', '📱', '🚜', '📺', '🎃'],
            'У': ['👂', '👄', '🏫', '🙂'],
            'Ф': ['⚽', '🔦', '🦩', '📷', '🥜'],
            'Х': ['🍞', '🐹', '🚁', '🪁', '🍔'],
            'Ц': ['🌺', '💐', '🌽', '🎻'],
            'Ч': ['☕', '🧦', '🍒', '☔', '⌚', '🖌️', '👜'],
            'Ш': ['🧢', '🎪', '🍫', '🍼', '🛷'],
            'Щ': ['🦗'],
            'Ъ': ['📐'],
            'Ю': ['👊', '🛌'],
            'Я': ['🍎', '🍓', '🥚', '🧥', '🦡']
        };
    }

    static generateProblem(level) {
        const vowels = ['А', 'Е', 'И', 'О', 'У', 'Ъ', 'Ю', 'Я'];
        const consonants = ['Б', 'В', 'Г', 'Д', 'Ж', 'З', 'Й', 'К', 'Л', 'М', 'Н', 'П', 'Р', 'С', 'Т', 'Ф', 'Х', 'Ц', 'Ч', 'Ш', 'Щ'];

        let letter;
        if (level === 1) {
            const emojiMap = this.getLetterEmojiMap();
            const letters = Object.keys(emojiMap);
            letter = letters[Math.floor(Math.random() * letters.length)];
            const emojis = emojiMap[letter];
            const emoji = emojis[Math.floor(Math.random() * emojis.length)];

            return {
                display: emoji,
                answer: letter,
                operation: 'emoji_letter_recognition',
                letter: letter
            };
        } else if (level === 2) {
            letter = vowels[Math.floor(Math.random() * vowels.length)];
        } else if (level === 3) {
            letter = consonants[Math.floor(Math.random() * consonants.length)];
        } else {
            const allLetters = [...vowels, ...consonants];
            letter = allLetters[Math.floor(Math.random() * allLetters.length)];
        }

        return {
            display: letter,
            answer: 'correct',
            operation: 'read'
        };
    }

    static getRewardMessages() {
        return ['BULGARIAN_REWARD_MESSAGES'];
    }

    static getOperationKey() {
        return 'LETTERS';
    }
}
