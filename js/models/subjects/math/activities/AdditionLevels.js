// Extension: Addition Levels - Moved from core MathModel for better separation
class AdditionLevels {
    static getLevels() {
        return {
            1: { descriptionKey: 'SINGLE_DIGITS' },
            2: { descriptionKey: 'PLACE_VALUE_RECOGNITION' },
            3: { descriptionKey: 'UP_TO_20' },
            4: { descriptionKey: 'PLACE_VALUE_CALCULATION' }
        };
    }
    
    static generateProblem(level) {
        if (level === 1) {
            // Level 1: Single digits (0-9), result must be <= 10
            let num1, num2;
            do {
                num1 = this.randomInt(0, 9);
                num2 = this.randomInt(0, 9);
            } while (num1 + num2 > 10);
            
            return {
                num1: num1,
                num2: num2,
                operation: '+',
                answer: num1 + num2
            };
        } else if (level === 2) {
            // Level 2: Place Value Recognition
            const num = this.randomInt(10, 99);
            const questionType = Math.random() < 0.5 ? 'ones' : 'tens';
            
            return {
                num1: num,
                questionType: questionType,
                operation: 'place_value_recognition',
                answer: questionType === 'ones' ? num % 10 : Math.floor(num / 10),
                display: num
            };
        } else if (level === 3) {
            // Level 3: Operations up to 20, result must be <= 20
            let num1, num2;
            do {
                num1 = this.randomInt(0, 20);
                num2 = this.randomInt(0, 20);
            } while (num1 + num2 > 20);
            
            return {
                num1: num1,
                num2: num2,
                operation: '+',
                answer: num1 + num2
            };
        } else if (level === 4) {
            // Level 4: Place Value Calculation (step-by-step)
            const num1 = this.randomInt(10, 49);
            const num2 = this.randomInt(10, 49);
            
            const ones1 = num1 % 10;
            const tens1 = Math.floor(num1 / 10);
            const ones2 = num2 % 10;
            const tens2 = Math.floor(num2 / 10);
            
            const onesSum = ones1 + ones2;
            const tensSum = tens1 + tens2;
            
            const onesFinal = onesSum % 10;
            const carryOver = Math.floor(onesSum / 10);
            const tensFinal = tensSum + carryOver;
            const finalAnswer = tensFinal * 10 + onesFinal;
            
            return {
                num1: num1,
                num2: num2,
                ones1: ones1,
                tens1: tens1,
                ones2: ones2,
                tens2: tens2,
                onesSum: onesSum,
                onesFinal: onesFinal,
                carryOver: carryOver,
                tensSum: tensSum,
                tensFinal: tensFinal,
                operation: 'place_value_calculation',
                answer: finalAnswer,
                currentStep: 1,
                stepAnswers: [onesSum, carryOver, tensSum + carryOver, finalAnswer],
                hasInfoIcon: false
            };
        }
        
        return {
            num1: 0,
            num2: 0,
            operation: '+',
            answer: 0
        };
    }
    
    static getRewardMessages() {
        return [
            'REWARD_MESSAGES' // Will be localized by the localization system
        ];
    }
    
    static getOperationKey() {
        return 'ADDITION';
    }
    
    static randomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
}