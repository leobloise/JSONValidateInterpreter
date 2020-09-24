import Evalueter from "../helper/Evalueter";
import Result from "../helper/Result";
import applyFuncValidation from "../interfaces/applyFuncValidation";
import commonValidation from "../interfaces/commonValidation";
import logicValidation from "../interfaces/logicValidation";
import runtimeErrorObject from "../interfaces/runtimeErrorObject";
import setValidation from "../interfaces/setValidation";
import validationPriority from "../interfaces/validationPriority";
import CommonValidations from "./CommonValidations";

class Validator {
    
    protected objectValidation: commonValidation | applyFuncValidation | logicValidation | setValidation | validationPriority;
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

    protected checkRelationship(response: Array<boolean|string>, validation: commonValidation | applyFuncValidation | logicValidation): Array<string | boolean> {
        
        let relationship: string | undefined = validation.relationship;

        if(typeof relationship !== 'undefined')
            response.push(this.getRelationship(relationship));

        return response
        
    }

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

    protected getField(field: any): any {

        if(typeof field !== 'function')
            return field;

        return field();
    }

    protected filterField(validation: commonValidation | applyFuncValidation): any {

        if(typeof validation.field !== "string") {
            this.runtimeError.error.push(`Field ${validation.field} is not valid or does not exist in ${this.object}. So, empty string will be given as result`)
            return '';
        }

        if(typeof this.object[validation.field] == "undefined") {
            this.runtimeError.error.push(`Field ${validation.field} is not valid or does not exist in ${this.object}. So, empty string will be given as result`)
            return '';
        }
        return this.applyProperlyProps(this.object[validation.field], validation.property);

    }

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

    protected checkIfPropOrNot(target: string): any {
       
        if(!target.includes('prop: ')) 
            return target

        let prop = target.split('prop:')[1].trim();
        return ((typeof this.object[prop] !== 'undefined')?this.object[prop]:'This property does not exist')

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