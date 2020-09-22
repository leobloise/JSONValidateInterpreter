const {InterpreterTranslator} = require('./InterpreterTranslator.js')
const {CommonValidations} = require('./CommonValidations.js')

class JSONValidatorInterpreter {

    constructor(targetObject, validateJson) {
        this._object = targetObject;
        this._json = validateJson
        this._allObjectValidations = this._getValidations();
        /**
         * @summary Garantir que todo erro tenha o nome do objeto.
         */
        this._object.__proto__.toString = function() {
            return this.constructor.name;
        }
        /**
         * 
         * @param {*} conditions
         * @summary Medida de segurança para utilizar o tradutor. 
         */
        this._translator = (conditions) => {
            let realTranslator = new InterpreterTranslator(conditions)
            return realTranslator.getTranslatedResult();
        }

    }

    /**
     * @summary Esse método deve ser o único método que você deverá chamar para criar todas as validações.
     */
    createAllConditions() {
        const allConditionsSolved = this._allObjectValidations.map(validations => this._createConditions(validations))
        return allConditionsSolved;
    }

    /**
     * @param none;
     * @summary Esse método recupera todos os objetos de validação.
     */

    _getValidations() {

        let validations = []

        for(let input in this._json) {
            
            validations.push(this._json[input].validations)
        }

        return validations;
    }

     /**
     * @param {*} validations 
     * @summary Esse método contem toda a lógica para criar um array de validações. Além disso, ela é recursiva.
     */

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

            if(validation.func) {
               let results = this._applyCommonValidations(validation);
			   conditions.conditionsSolved.push(results)
			   if(this._verifyRelationship(validation)) 
                    conditions.conditionsSolved.push(this._verifyRelationship(validation))

                if(validation.res) 
                    conditions.conditionsSolved.push(validation.res)
               return;
            }

            if(validation.set && !validation.validation) {
               
                let results = this._createNewFieldValidationLogic(validation);
                conditions.conditionsSolved.push(results)
                return;
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

        });

        return conditions.conditionsSolved

    }

    /**
     * @param {*} validation 
     * @summary Esse método contem toda a lógica para a aplicação de uma validação comum.
     * Além disso, é necessário a utilização de um CommonValidations.
     */

    _applyCommonValidations(validation) {

		let object = this._object[validation.field];
       
		if(validation.property) {
			object = this._applyProperty(validation)
        }
        
        let commonValidation = new CommonValidations(object)

        if(typeof commonValidation[validation.func] !== 'function'){
            throw new Error('This function does not exist')
        }

        return commonValidation[validation.func]();
    
    }
     /**
     * @param {*} validation 
     * @summary Esse método contem toda a lógica para a aplicação de uma propriedade em um campo.
     */
    _applyProperty(validation) {

        console.log('Validação Passando aqui', validation)

        let object = this._object[validation.field]

        validation.property.forEach(prop => {
            console.log('Property =>', prop)
           object = this._verifyAndReturnProperlyField(object, prop)

        })

        console.log(object)

        return object

    } 

    /**
     * @param {*} validation 
     * @summary Esse método contem toda a lógica para a criação de um campo em tempo de execução.
     */
    _createNewFieldValidationLogic(validation) {

        if(validation.validationsNeed) {

            let results = [this._createConditions(validation.validationsNeed)]

            let resultToValidate = this._translator(results)[0]
            
            let newField = validation.set;
            
            let permission = (validation.expected == 'false')?false:true;

            let value = (validation.value)?validation.value:undefined;

            if(value.includes('prop:')) {

                value = value.split('prop:')
                value = this._verifyAndReturnProperlyField(this._object, value[1].trim())
            
            }
            return this._createNewProp(this._object, newField, value, resultToValidate.condition, permission)
        }

         let newField = validation.set;
		 let value = (validation.value)?validation.value:undefined;
		 
		 if(value.includes('prop:')) {

			value = value.split('prop:')
			value = this._verifyAndReturnProperlyField(this._object, value[1].trim())
		
		}

         return this._createNewProp(this._object, newField, value);
    }

    /**
     * @method _createNewProp
     * @summary Tenta criar um campo novo em tempo de execucao e, caso nao consiga, ira retornar false ou um erro.
     * @param {*} object 
     * @param {*} newField 
     * @param {*} value 
     * @param {*} resultFromCondtion 
     * @param {*} permission 
     */

    _createNewProp(object, newField, value = 'default', resultFromCondtion = true, permission = true) {
        
        if(Boolean(resultFromCondtion) != Boolean(permission)) 
            return false;
        
        if(object[newField] === undefined)
            object[newField] = value;
        else
            throw new Error(`${newField} has already been declared at ${object.constructor.name}`)
        
        return true;
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
		
		if(validation.func) {
			let results = this._applyCommonValidations(validation);
			conditions.push(results)
			return conditions;
		}

        this._verifyIfItExistsInsideObject(validation);
        
        let field = (typeof validation.property == "object")?this._applyProperty(validation):this._object[`${validation.field}`];

        let target = this._applyProperlyTarget(validation)
		
		if(typeof field == 'function') {
			field = field();
		}

        conditions.push(this._getConditionResult(field, validation.operator, target));
    
        return conditions;

    }

    _verifyAndReturnProperlyField(field, property){
    
        if(!field.hasOwnProperty(property) || typeof field[property] === 'undefined') 
            return undefined;

        if(typeof field[property] !== 'function')
            return field[property]

        return field[property]();
    
    }

    _applyProperlyTarget(validation) {
        
        console.log(validation)

        let target = this._verifyAndReturnProperlyTarget(validation.target)

        if(typeof validation.property_target != "object")
            return target
        
        if(typeof validation.type == "string")
            target = this._transformToSpecifcyType(target, validation.type)

        validation.property_target.forEach(prop => {
            
            if(typeof target[prop] == 'undefined')
                throw new Error('Essa propriedade não existe')
            
            target = this._verifyAndReturnProperlyField(target, prop)
        })

        return target;

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
           
            logicConditions.push(this._validateAndGetConditions(validation[condition]))
        }

        return logicConditions.reduce((acumulator, logicCondition) => Number(acumulator) + Number(logicCondition[0]), 0)

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

		if(this._object[validation.field] == '')
			return;
        if(!this._object[validation.field])
            throw new Error(`${validation.field} does not exist in ${this._object}`)
    }
}

module.exports = {JSONValidatorInterpreter};