import { Console } from "console";
import applyFuncValidation from "../interfaces/applyFuncValidation";
import commonValidation from "../interfaces/commonValidation";
import logicValidation from "../interfaces/logicValidation";
import validationPriority from "../interfaces/validationPriority";
import validation_general from "../interfaces/validation_general";
import CommonValidations from "./CommonValidations";
import Evalueter from "./Evalueter";
import Result from "./Result";

interface runtimeErrorObject {
    error: Array<string>
}


class JSONInterpreter {

    private _object: any;
    private _json: any;
    private commonValidations: Function;
    private runtimeError: runtimeErrorObject = {
        error: []
    }

    constructor(object: any, json: any) {

        this._object = object;

        this._json = json

        this.commonValidations = (field: any, operation: string) => {
            
            let realCommonValidations: any = new CommonValidations(field);
            
            if(typeof realCommonValidations[operation] !== 'function'){
               this.runtimeError.error.push(`This operation ${operation} does not exist in CommonValidations`);
                return '';
            }
    
            return realCommonValidations[operation]();
        }


    }

    public teste() {
        
        let conditions = this.getAllConditionsFromJson();

        let result: any = {}
        
        for(let validation in conditions ) {

            result[validation] = this.createCondition(conditions[validation]);
        
        }
    
        return {
            result:result,
            errors: this.runtimeError.error
        };
    }   

    private getAllConditionsFromJson() {
        
        let allConditions: any = {}

        for(let validation in this._json) {

            allConditions[validation] = (this._json[validation])

        }

        return allConditions;

    }

    /**
     * @method createCondition
     * @param validations 
     * @summary Method that execute all conditions and get the result
     */

    protected createCondition(validations: validation_general ): Array<Array<boolean | string>> {

        let conditionsSolved: any = {
            conditions: []
        }
    
        validations.validations.forEach(validation => { 

            if(validation.validation) {

                let results = this.doPriorityValidation(validation.validation as validationPriority)  
                conditionsSolved['conditions'].push(results);

            } 

            if(validation.func) {

                let response = this.applyCommonValidations(validation as applyFuncValidation);
                conditionsSolved['conditions'].push(response)
                return;

            }

            if(validation.operator == "or" || validation.operator == "and") {

                let response = this.calc(validation as logicValidation)
                conditionsSolved['conditions'].push(response);
                return;

            }

            let response = this.checkResAndRelationShip(this.calcAndGetConditionResult(validation as commonValidation), validation as commonValidation | applyFuncValidation | logicValidation);
            conditionsSolved['conditions'].push(response);

        })

        return conditionsSolved;
    }

    private applyCommonValidations(validation: applyFuncValidation) {
        
		let object = this._object[validation.field];
       
		if(validation.property) 
		    object = this.applyProperlyProps(object, validation.property)
            
        let result = [this.commonValidations(object, validation.func)]
        
        result = this.checkResAndRelationShip(result, validation);

        return result;
    
    }

    private doPriorityValidation(validation: validationPriority) {
        
        let results = [this.createCondition({
            validations: validation.validations 
        } as validation_general)]

        let realResult: Array<boolean | string> = this.calcAndTranslateResultFromConditions(results)[0]

        let relationship = validation.operator;

        realResult.push(this.getRelationship(relationship))

        return realResult;

    }
    
    private calc(validation: logicValidation) {
        
        if(validation.operator == 'and') {

            let result = this.logicAndConditions(validation)
            let readyForReturn = this.checkResAndRelationShip(result, validation)
            
            return readyForReturn;
        
        }
            
            let result = this.logicOrConditions(validation)
            let readyForReturn = this.checkResAndRelationShip(result, validation)
            
            return readyForReturn;

    }

    private calcAndTranslateResultFromConditions(conditions:  Array<object>): Array<Array<boolean|string>> {

        return new Evalueter(new Result(conditions).result).evaluete;
    
    }

    private conditionGeneralLogic(validation: any) {

        let quantityValidations = this.verifyIfQuantityIsCorrectAndGetIt(validation);

        let logicConditions = []

        for(let i = 1; i <= quantityValidations; i++) {

            let condition: string = 'condition'+String(i);
           
            logicConditions.push(this.createCondition(
                {
                    validations: [validation[condition]]
                } as validation_general))
        }

        return this.calcAndTranslateResultFromConditions(logicConditions)

    }

    /**
     * @method logicAndConditions
     * @param validation 
     * @summary It will calculate and get conditions using OR validation.
     */

    private logicAndConditions(validation: any) {

        let allValues = this.conditionGeneralLogic(validation)
        
        return [Boolean(allValues.reduce((acumulator: number, value) => {
            return acumulator *= Number(value[0])
        }, 1))];

    }

    /**
     * @method logicOrConditions
     * @param validation 
     * @summary It will calculate and get conditions using OR validation.
     */
    
    private logicOrConditions(validation: any) {
	
        let allValues = this.conditionGeneralLogic(validation)

        return [Boolean(allValues.reduce((acumulator: number, value) => {
            return acumulator += Number(value[0])
        }, 0))];
    }

    private verifyIfQuantityIsCorrectAndGetIt(validation: logicValidation) {
        
        let quantityValidations = this.getQtdConditions(validation)

        if(quantityValidations < 2) {
            this.runtimeError.error.push(`There are not enough conditionals to do this validation: ${validation}`)
            return quantityValidations;
        }

        return quantityValidations
    
    }

    private getQtdConditions(validation: logicValidation) {

        let quantityValidations = 0;

        for(let condition in validation) {
            if(condition.includes('condition')) {
                quantityValidations++;
            }
        }

        return quantityValidations;
    }

    /**
     * @method checkResAndRelationShip
     * @param response 
     * @param validation 
     * @summary It will check if there are any relationship and\or res. Then, it will treat them properly.
     */

    private checkResAndRelationShip(response: Array<boolean|string>, validation: commonValidation | applyFuncValidation | logicValidation): Array<string | boolean> {
        
        let relationship: string | undefined = validation.relationship;

        if(typeof relationship !== 'undefined')
            response.push(this.getRelationship(relationship));


        let res = this.checkIfResExist(validation as commonValidation | logicValidation)
        
        if(res.length > 0) 
            response.push(res);

        return response
        
    }

    private getRelationship(relationship: string): string {

        switch(relationship) {
            case "and":
                return '*'
            case "or":
                return '+'
            default:
                this.runtimeError.error.push(`This ${relationship} does not exist. So, relationship or will be used`);
                return '+';
        }   

    }

    /**
     * @method calcAndGetConditionResult
     * @param validation 
     * @summary This method will return the result of condition 
     */

    private calcAndGetConditionResult(validation: commonValidation): Array<boolean> {
        
        let field = this.filterField(validation);
        let target = this.filterTarget(validation);

        return [this.getConditionResult(field, validation.operator, target)]
    }

    /**
     * @method checkIfResExist
     * @param validation 
     * @summary This method check if any res was defined and, if it's defined, it'll be returned.
     */
    private checkIfResExist(validation: commonValidation | logicValidation): string {

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

    private filterTarget(validation: commonValidation): string {
        
        let target = this.checkIfPropOrNot(validation.target)
      
        if(validation.type) 
            target = this.transformTo(target, validation.type)
        
        if(validation.property_target) {

            validation.property_target.forEach(prop => {
        
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

    private checkIfPropOrNot(target: string): any {
       
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

    private transformTo(srt: string, type: string): string | boolean | number {
        
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
                this.runtimeError.error.push(`This ${type} does not exist or not coded. So, String will be used`)
                return String(srt);
        }

    }

    /**
     * @method filterField
     * @param validation 
     * @summary This method will correct the field and get it from object.
     */
    private filterField(validation: commonValidation | applyFuncValidation): any {

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
    private applyProperlyProps(field: any, prop?: Array<string>): any {

        if(!prop) 
            return this.getField(field)

        prop.forEach(eachProp => {
            if(typeof field[eachProp] == "undefined") {
                this.runtimeError.error.push(`Property ${eachProp} does not exist in ${field}. So, empty string will be given as result`)
                return '';
            }
                
            
            if(typeof field[eachProp] == "function") {
                field = field[eachProp]();
                return;
            }

            field = field[eachProp];
            return;
        })

        return field;
    }


    /**
     * @method getField
     * @param field 
     * @summary This method will get a pure field.
     */    
    private getField(field: any): any {

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
    private getConditionResult(field: any, operator: string, target: any): boolean {

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
                this.runtimeError.error.push(`This ${operator} does not exist or not coded: talk with Leo2 or read the documentation. So, false will be returned`)
                return false;
        }

    }

}

export default JSONInterpreter;