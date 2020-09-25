import Evalueter from "../../helper/Evalueter";
import Result from "../../helper/Result";
import applyFuncValidation from "../../interfaces/validations/primary/applyFuncValidation";
import arrayValidation from "../../interfaces/validations/primary/arrayValidation";
import commonValidation from "../../interfaces/validations/primary/commonValidation";
import logicValidation from "../../interfaces/validations/secundary/logicValidation";
import runtimeErrorObject from "../../interfaces/runtimeErrorObject";
import setValidation from "../../interfaces/setValidation";
import validationPriority from "../../interfaces/validations/secundary/validationPriority";
import CommonValidations from "../../helper/CommonValidations";

class Validator {
    
    protected objectValidation: commonValidation | arrayValidation | applyFuncValidation | logicValidation | setValidation | validationPriority;
    protected runtimeError: runtimeErrorObject
    protected object: any;
    protected resultFunc: Function = (result: Array<Array<Array<boolean|string>>>) => {
    
        let realResult = new Result(result).result;
    
        return realResult;
    
    }
    protected commonValidations: Function = (field: any, operation: string) => {
            
        let realCommonValidations: any = new CommonValidations(field);
        
        if(typeof realCommonValidations[operation] !== 'function'){
           this.runtimeError.error.push(`This operation ${operation} does not exist in CommonValidations`);
            return '';
        }

        return realCommonValidations[operation]();
    }

    constructor(objectValidation: commonValidation | applyFuncValidation | logicValidation | setValidation | validationPriority, object: any ) {

        this.objectValidation = objectValidation
        this.runtimeError = {
            error: []
        }
        this.object = object
    
    }

    /**
     * @method checkRelationship
     * @param response 
     * @param validation 
     * @summary This method will check if there are any relationship between two validations. If it's true, then 
     * the math operation equivalent to this relationship will be added to response.
     */
    protected checkRelationship(response: Array<boolean|string>, validation: commonValidation | applyFuncValidation | logicValidation): Array<string | boolean> {
        
        let relationship: string | undefined = validation.relationship;

        if(typeof relationship !== 'undefined')
            response.push(this.getRelationship(relationship));

        return response
        
    }

    /**
     * @method getRelationship
     * @param {strng} relationship 
     * @summary This method will translate the relationship given.
     */

    protected getRelationship(relationship: string): string {

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
     * @method applyProperlyProps
     * @param field 
     * @param prop 
     * @summary This method will get an array of propertys and, first of all, check if it was really given. If it's false,
     * it will return only the field, but, if it's true, it will go through this entire array and check if the property
     * is valid, if it's, it'll apply it correctly. If it's not, it will give you a runtimeError.
     */

    protected applyProperlyProps(field: any, prop?: Array<string>): any {

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
     * @summary It'll only get the field correctly and not apply any property.
     */

    protected getField(field: any): any {

        if(typeof field !== 'function')
            return field;

        return field();
    }

    /**
     * @method filterField
     * @param validation 
     * @summary It will check if the field is valid andm then, return it with all properties applied 
     */

    protected filterField(validation: commonValidation | applyFuncValidation): any {

        if(typeof validation.field !== "string") {
            this.runtimeError.error.push(`Field in ${validation} is not valid or does not exist in ${this.object}. So, empty string will be given as result`)
            return '';
        }

        if(typeof this.object[validation.field] == "undefined") {
            this.runtimeError.error.push(`Field in ${validation} is not valid or does not exist in ${this.object}. So, empty string will be given as result`)
            return '';
        }
        
        return this.applyProperlyProps(this.object[validation.field], validation.property);

    }

    
    /**
     * @method filterTarget
     * @param validation 
     * @summary It will check if the target is valid andm then, return it with all properties applied 
     */

    protected filterTarget(validation: commonValidation): string {

            if(typeof validation.target !== "string") {
                this.runtimeError.error.push(`Target ${validation.target} is not valid or does not exist. So, empty string will be given as result`)
                return '';
            }

            let target = this.checkIfPropOrNot(validation.target)
          
            if(!validation.type && validation.operator.includes('strict')) {
                this.runtimeError.error.push(`Strict comparison must be done using types`)
                return '';
            } 
            
            if(validation.type) 
                target = this.transformTo(target, validation.type)
            
            if(validation.property_target) {
    
                validation.property_target.forEach(prop => {
            
                    target = this.applyProperlyProps(target, [prop]);
    
                })
    
            }
    
            return target;
    
    }

    protected getConditionResult(field: any, operator: string, target: any): boolean {
       
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
                this.runtimeError.error.push(`This ${operator} does not exist or not coded: read the documentation. So, false will be returned`)
                return false;
        }

    }

    /**
     * @method checkIfPropOrNot
     * @param target 
     * @summary It will check if there are any "prop" inside the target and return it properly.
     */

    protected checkIfPropOrNot(target: string): any {
       
        if(!target.includes('prop:')) 
            return target

        let prop = target.split('prop:')[1].trim();
        return this.applyProperlyProps(this.object, [prop])

    }

    protected transformTo(srt: string, type: string): string | boolean | number {
        
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

    protected calcAndTranslateResultFromConditions(conditions:  Array<object>): Array<Array<boolean|string>> {

        return new Evalueter(this.resultFunc(conditions)).evaluete;
    
    }

}

export default Validator;