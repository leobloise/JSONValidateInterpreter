class JSONValidatorInterpreter {

    constructor(targetObject, validateJson) {
        this._object = targetObject;
        this._json = validateJson
        this._allObjectValidations = this._getValidations();
        this._object.__proto__.toString = function() {
            return this.constructor.name;
        }
    }

    createAllConditions() {
        const allConditionsSolved = this._allObjectValidations.map(validations => this.createConditions(validations))
        return allConditionsSolved;
    }

    _getValidations() {

        let validations = []

        for(let input in this._json) {
            validations.push(this._json[input].validations)
        }

        return validations;
    }

    createConditions(validations) {

        let  conditions = []
        
        validations.forEach(validation => {

            if(validation.validation) {
                
                let results = this.createConditions(validation.validation.validations)
                results.forEach(result => conditions.push(result))
                conditions.push(this._getCorrectMathOperationFromOperationLogic(validation.validation))
            }
            
            if(validation.operator === "or") {

                const resultLogicOrCondition = this._logicOrConditions(validation)
                conditions.push(Boolean(resultLogicOrCondition))

                if(this._verifyRelationship(validation)) {
                    conditions.push(this._verifyRelationship(validation))
                }
                        
                return;
            }

            if(validation.operator == "and") {

                const resultLogicAndCondition = this._logicAndConditions(validation)
                conditions.push(Boolean(resultLogicAndCondition))
                if(this._verifyRelationship(validation)) {
                    conditions.push(this._verifyRelationship(validation))
                }

                return;
            }

            conditions.push(this._validateAndGetConditions(validation)[0])
            if(this._verifyRelationship(validation)) {
                conditions.push(this._verifyRelationship(validation))
            }

        })

        return conditions

    }

    _getConditionResult(field, operator, target) {

        switch(operator) {
            case 'bigger':
                return field > target;
            case 'smaller':
                return  field < target;
            case 'equal':
                return field == target;
            case 'diff':
                return field != target;
            case 'biggerequal':
                return field >= target;
            case 'smallerequal':
                return field <= target;
            default:
                throw new SyntaxError(`This operator does not exist or not coded: talk with Leo2 or read the documentation`)
        }

    }

    _validateAndGetConditions(validation) {

        
        let conditions = []
    
        this._verifyIfItExistsInsideObject(validation);

        let field = (typeof validation.property == 'string')?this._object[`${validation.field}`][validation.property]:this._object[`${validation.field}`];
        
        conditions.push(this._getConditionResult(field, validation.operator, validation.target));

        return conditions;

    }

    _getCorrectMathOperationFromOperationLogic(validation) {
        if(validation.operator == 'or') {
            return '+'
        } 

        return '*'
    }

    _getQtdConditions(validation) {

        let quantityValidations = 0;

        for(let condition in validation) {
            if(condition.includes('condition')) {
                quantityValidations++;
            }
        }

        return quantityValidations;
    }

    _verifyIfQuantityIsCorrectAndGetIt(validation) {
        
        let quantityValidations = this._getQtdConditions(validation)

        if(quantityValidations < 2) {
            throw new SyntaxError('This operation is not valid')
        }

        return quantityValidations
    }

    _logicOrConditions(validation) {

        let quantityValidations = this._verifyIfQuantityIsCorrectAndGetIt(validation);

        let logicConditions = []

        for(let i = 1; i <= quantityValidations; i++) {

            let condition = 'condition'+String(i);
            
            logicConditions.push(this._validateAndGetConditions(validation[condition])[0])
        }

        return logicConditions.reduce((acumulator, logicCondition) => acumulator + Number(logicCondition))
    }

    _logicAndConditions(validation) {

        let quantityValidations = this._verifyIfQuantityIsCorrectAndGetIt(validation)
                    
        let logicConditions = []

        for(let i = 1; i <= quantityValidations; i++) {

            let condition = 'condition'+String(i);
            logicConditions.push(this._validateAndGetConditions(validation[condition])[0])
        
        }

        return logicConditions.reduce((acumulator, logicCondition) => acumulator * Number(logicCondition), 1)
    }

    _verifyRelationship(validation) {
        if(!validation.relationship) {
            return;
        }

        if(validation.relationship == 'and') {
            return '*'
        } else if(validation.relationship == 'or') {
            return '+'
        }
    }

    _verifyIfItExistsInsideObject(validation) {

        if(!this._object[validation.field])
            throw new Error(`${validation.field} does not exist in ${this._object}`)
    }
}

exports.JSONValidatorInterpreter = JSONValidatorInterpreter;