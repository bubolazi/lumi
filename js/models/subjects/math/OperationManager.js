// Operation Manager - Manages available math operations
class OperationManager {
    constructor() {
        this.operations = {
            'addition': {
                key: 'ADDITION',
                extensionClass: AdditionLevels,
                icon: '+'
            },
            'subtraction': {
                key: 'SUBTRACTION', 
                extensionClass: SubtractionLevels,
                icon: '-'
            }
            // Future operations can be added here:
            // 'multiplication': {
            //     key: 'MULTIPLICATION',
            //     extensionClass: MultiplicationLevels,
            //     icon: '×'
            // },
            // 'division': {
            //     key: 'DIVISION',
            //     extensionClass: DivisionLevels,
            //     icon: '÷'
            // }
        };
    }
    
    // Get all available operations
    getAvailableOperations() {
        return this.operations;
    }
    
    // Get operation extension by name
    getOperationExtension(operationName) {
        const operation = this.operations[operationName];
        return operation ? operation.extensionClass : null;
    }
    
    // Get operation key for localization
    getOperationKey(operationName) {
        const operation = this.operations[operationName];
        return operation ? operation.key : null;
    }
    
    // Get operation icon
    getOperationIcon(operationName) {
        const operation = this.operations[operationName];
        return operation ? operation.icon : '?';
    }
    
    // Check if operation exists
    hasOperation(operationName) {
        return this.operations.hasOwnProperty(operationName);
    }
}