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
        const allConditionsSolved = this._allObjectValidations.map(validations => this._createConditions(validations))
        return allConditionsSolved;
    }

    _getValidations() {

        let validations = []

        for(let input in this._json) {
            
            validations.push(this._json[input].validations)
        }

        return validations;
    }

    _createConditions(validations) {

        let  conditions = {
            conditionsSolved: []
        }
        
        validations.forEach(validation => {
            if(validation.validation) { 
                let results = this._createConditions(validation.validation.validations)
                
                results.forEach(result => conditions.conditionsSolved.push(result))
                conditions.conditionsSolved.push(this._getCorrectMathOperationFromOperationLogic(validation.validation))
            }
            
            if(validation.operator === "or") {

                const resultLogicOrCondition = this._logicOrConditions(validation)
                conditions.conditionsSolved.push(Boolean(resultLogicOrCondition))

                if(this._verifyRelationship(validation)) 
                    conditions.conditionsSolved.push(this._verifyRelationship(validation))

                if(validation.res) 
                    conditions.conditionsSolved.push(validation.res)
                        
                return;
            }

            if(validation.operator == "and") {

                const resultLogicAndCondition = this._logicAndConditions(validation)
                conditions.conditionsSolved.push(Boolean(resultLogicAndCondition))

                if(this._verifyRelationship(validation)) {
                    conditions.conditionsSolved.push(this._verifyRelationship(validation))
                }

                if(validation.res) {
                    conditions.conditionsSolved.push(validation.res)
                }

                return;
            }

            conditions.conditionsSolved.push(this._validateAndGetConditions(validation)[0])
            
            if(this._verifyRelationship(validation)) {
                conditions.conditionsSolved.push(this._verifyRelationship(validation))
            }

            if(validation.res) {
                conditions.conditionsSolved.push(validation.res)
            }

        })

        return conditions.conditionsSolved

    }

    /**
     * @method _getConditionResult
     * @param {string} field
     * @param {string} operator
     * @param {string} target
     * @summary This method will get the result from any logic operation defined by a field, operator and target.
     */

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
            case 'strictequal':
                return field === target;
            case 'strictdiff':
                return field !== target;
            default:
                throw new SyntaxError(`This operator does not exist or not coded: talk with Leo2 or read the documentation`)
        }

    }

    /**
     * @method _validateAndGetConditions
     * @param {object} validation
     * @summary This method check if any validation is corret and valid and, then, apply it.
     */

    _validateAndGetConditions(validation) {

        
        let conditions = []
    
        this._verifyIfItExistsInsideObject(validation);

        // console.log('\nUntreated validation.field: ', validation.field  + '\n\n')
        // console.log('Untreated validation.property: ', validation.property  + '\n\n')
        // console.log('Untreated validation.target: ', validation.target  + '\n\n')
        
        let field = (typeof validation.property == 'string')?this._verifyAndReturnProperlyField(this._object[`${validation.field}`], validation.property):this._object[`${validation.field}`];

        let target = (typeof validation.type == 'string')?this._transformToSpecifcyType(this._verifyAndReturnProperlyTarget(validation.target), validation.type):this._verifyAndReturnProperlyTarget(validation.target)

        // console.log('Treated field: ', field + '\n\n')
        // console.log('Treated target ', target  + '\n\n')
        
        conditions.push(this._getConditionResult(field, validation.operator, target));
    
        return conditions;

    }

    _verifyAndReturnProperlyField(field, property){
        if(!field.hasOwnProperty(property) || typeof field[property] === 'undefined') 
            throw new Error('This property is not defined')

        if(typeof field[property] !== 'function')
            return field[property]

        return field[property]();
    }


    _verifyAndReturnProperlyTarget(target) {

        if(target.includes('prop: ')) {
            /**
             * Divido a string em duas partes e pego somente aquela que contem o nome da propriedade
             * A funcao trim retira os espacos em branco que nao estao no meio da string.
             */
            let prop = target.split('prop:')[1].trim();

            target = this._verifyAndReturnProperlyField(this._object, prop)
        }

        return target;
    }

    _transformToSpecifcyType(target, type) {
        
        switch(type) {
            case 'Number':
                return Number(target)
            case 'Boolean':
                return Boolean(target)
            case 'String':
                return String(target)
            default:
                throw new Error('This type does not exist or not coded')
        }

    }

    /**
     * @method _getCorrectMathOperationFromOperationLogic
     * @param {object} validation
     * @summary This method get equivalent math operator to any logic operator.
     */

    _getCorrectMathOperationFromOperationLogic(validation) {
        if(validation.operator == 'or') {
            return '+'
        } 

        return '*'
    }

     /**
     * @method _getQtdConditions
     * @param {object} validation
     * @summary This method get how many validations exists inside an object validation.
     * 
     */

    _getQtdConditions(validation) {

        let quantityValidations = 0;

        for(let condition in validation) {
            if(condition.includes('condition')) {
                quantityValidations++;
            }
        }

        return quantityValidations;
    }

    /**
     * @method _verifyIfQuantityIsCorrectAndGetIt
     * @param {object} validation
     * @summary This method apply 'or' logic and return the resut.
     * 
     */

    _verifyIfQuantityIsCorrectAndGetIt(validation) {
        
        let quantityValidations = this._getQtdConditions(validation)

        if(quantityValidations < 2) {
            throw new SyntaxError('This operation is not valid')
        }

        return quantityValidations
    }

    /**
     * @method _logicOrConditions
     * @param {object} validation
     * @summary This method apply 'or' logic and return the resut.
     * 
     */

    _logicOrConditions(validation) {

        let quantityValidations = this._verifyIfQuantityIsCorrectAndGetIt(validation);

        let logicConditions = []

        for(let i = 1; i <= quantityValidations; i++) {

            let condition = 'condition'+String(i);
            
            logicConditions.push(this._validateAndGetConditions(validation[condition])[0])
        }

        return logicConditions.reduce((acumulator, logicCondition) => acumulator + Number(logicCondition))
    }

    /**
     * @method _logicAndConditions
     * @param {object} validation
     * @summary This method apply 'and' logic and return the resut.
     * 
     */

    _logicAndConditions(validation) {

        let quantityValidations = this._verifyIfQuantityIsCorrectAndGetIt(validation)
                    
        let logicConditions = []

        for(let i = 1; i <= quantityValidations; i++) {

            let condition = 'condition'+String(i);
            logicConditions.push(this._validateAndGetConditions(validation[condition])[0])
        
        }

        return logicConditions.reduce((acumulator, logicCondition) => acumulator * Number(logicCondition), 1)
    }

    /**
     * @method _verifyRelationship
     * @param {object} validation
     * @summary This method will check the relationship between the conditions and return math equivalent operator.
     * 
     */

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

    /**
     * @method _verifyIfItExistsInsideObject
     * @param {object} validation
     * @summary This method will check if the property that you want to access really exists. 
     */

    _verifyIfItExistsInsideObject(validation) {

        if(!this._object[validation.field])
            throw new Error(`${validation.field} does not exist in ${this._object}`)
    }
}

exports.JSONValidatorInterpreter = JSONValidatorInterpreter;