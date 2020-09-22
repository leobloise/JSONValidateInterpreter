import { type } from "os";
import applyFuncValidation from "../interfaces/applyFuncValidation";
import commonValidation from "../interfaces/commonValidation";
import logicValidation from "../interfaces/logicValidation";
import setValidation from "../interfaces/setValidation";
import validation_general from "../interfaces/validation_general";

class JSONInterpreter {

    private _object: any;
    private _json: any;

    constructor(object: any, json: object) {

        this._object = object;
        this._json = json
        // this._allObjectValidations = this._getValidations();
        // /**
        //  * @summary Garantir que todo erro tenha o nome do objeto.
        //  */
        this._object.__proto__.toString = function() {
            return this.constructor.name;
        }
        /**
        //  * 
        //  * @param {*} conditions
        // //  * @summary Medida de segurança para utilizar o tradutor. 
        // //  */
        // // this._translator = (conditions) => {
        // //     let realTranslator = new InterpreterTranslator(conditions)
        // //     return realTranslator.getTranslatedResult();
        // // }

    }

    /**
     * @method createCondition
     * @param validations 
     * @summary Method that execute all conditions and get the result
     */

    private createCondition(validations: validation_general ) {
        
        let conditionsSolved = []

        validations.validations.forEach(validation => { 

            let response = this.calcAndGetConditionResult(validation as commonValidation)
            conditionsSolved.push(response);
        })

    }
    
    /**
     * @method calcAndGetConditionResult
     * @param validation 
     * @summary This method will return the result of condition 
     */

    private calcAndGetConditionResult(validation: commonValidation) {
        
        let field = this.filterField(validation);
        let target = this.filterTarget(validation);

        return [this.getConditionResult(field, validation.operator, target)]
    }

    /**
     * @method checkIfResExist
     * @param validation 
     * @summary This method check if any res was defined and, if it's defined, it'll be returned.
     */
    private checkIfResExist(validation: commonValidation | logicValidation) {

        if(!validation.res) {
             return '';
        } 

        return validation.res;
    }

    /**
     * @method filterTarget
     * @param validation 
     * @summary This method will correct the field and get it from object.
     */

    private filterTarget(validation: commonValidation) {
        
        let target = this.checkIfPropOrNot(validation.target)
      
        if(validation.type) 
            target = this.transformTo(target, validation.type)
        
        if(validation.property_target) {

            validation.property_target.forEach(prop => {
            
                if(typeof target[prop] == 'undefined')
                    throw new Error('Essa propriedade não existe')
                
                target = this.applyProperlyProps(target, [prop]);

            })

        }

        return target;
    }

    /**
     * @method checkIfPropOrNot
     * @param target 
     * @summary Check if there is a prop to use and get.
     */

    private checkIfPropOrNot(target: string) {
       
        if(!target.includes('prop: ')) 
            return target

        let prop = target.split('prop:')[1].trim();
        return ((typeof this._object[prop] !== 'undefined')?this._object[prop]:'This property does not exist')

    }

    /**
     * @method transformTo
     * @param srt 
     * @param type 
     * @summary Transform some string to another type.
     */

    private transformTo(srt: string, type: string) {
        
        switch(type) {
            case 'Number':
                
                return Number(srt)
            case 'Boolean':

                if(srt === 'false') {
                    return false;
                }
                
                return Boolean(srt)
            case 'String':
                return String(srt)
            default:
                throw new Error('This type does not exist or not coded')
        }

    }

    /**
     * @method filterField
     * @param validation 
     * @summary This method will correct the field and get it from object.
     */
    private filterField(validation: commonValidation | applyFuncValidation) {

        if(!validation.field.includes('prop:')) 
            return this.applyProperlyProps(this._object[validation.field], validation.property)


        let fieldProp = validation.field.split('prop:')[1].trim();
        return this.applyProperlyProps(this._object[fieldProp], validation.property);

    }

    /**
     * @method applyProperlyProps
     * @param field 
     * @param prop 
     * @summary This method will check and get the properly field using properties or not.
     */
    private applyProperlyProps(field: any, prop?: Array<string>) {

        if(!prop) 
            return this.getField(field)

        
        prop.forEach(eachProp => {

            if(typeof field[eachProp] == "undefined")
                throw new Error('You are trying to access some property that does not exist inside this object')
        
            field = field[eachProp];

        })
       
        return field;
    }


    /**
     * @method getField
     * @param field 
     * @summary This method will get a pure field.
     */    
    private getField(field: any) {

        if(typeof field !== 'function')
            return field;

        return field();
    }

    /**
     * @method getConditionResult
     * @param {any} field
     * @param {any} operator
     * @param {any} target
     * @summary This method will get the result from any logic operation defined by a field, operator and target.
     */
    private getConditionResult(field: any, operator: string, target: any) {

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

}