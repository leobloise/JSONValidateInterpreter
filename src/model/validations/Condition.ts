import { strict } from "assert";
import Result from "../../helper/Result";
import resultFromValidator from "../../interfaces/resultFromValidator";
import runtimeErrorObject from "../../interfaces/runtimeErrorObject";
import Condition_interface from "../../interfaces/validations/Condition";
import ValidationPriority from "../../interfaces/validations/secundary/validationPriority";
import Validation from "./Validation";
import ValidationStandard from "./ValidationStandard";


class Condition implements Condition_interface {

    public kind: string
    public relationship?: string;
    public validation?: ValidationPriority;
    protected runtimeErrors: runtimeErrorObject = {
        error: []
    }
    protected resultFunc: Function = (result: Array<Array<Array<boolean|string>>>) => {
    
        let realResult = new Result(result).result;
    
        return realResult;
    
    }

    constructor(kind: string, relationship?: string, validation?: ValidationPriority) {
        this.validation = validation;
        this.relationship = this.checkRelationship(relationship);
        this.kind = kind;
    }

    /**
     * @method checkRelationship
     * @param response 
     * @param validation 
     * @summary This method will check if there are any relationship between two validations. If it's true, then 
     * the math operation equivalent to this relationship will be added to response.
     */
    protected checkRelationship(relationship: string | undefined) {

        if(typeof relationship !== 'undefined')
            return (this.getRelationship(relationship));

        return undefined;
        
    }

    protected pushRelationship(result: Array<string | boolean>): Array<string | boolean>  {

        if(this.relationship)
            result.push(this.relationship);
        
        return result;
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
                this.pushError(`This ${relationship} does not exist. So, relationship or will be used`);
                return '+';
        }   

    }

    public result(structure: any): resultFromValidator {

        console.log('VOCÊ DEVE ME ALTERAR!');
        return {
            errors: [''],
            result: ['']
        }

    }

    protected filterField(structure: any, validation: Validation): any {
        
        if(typeof validation.field !== "string") {
            this.pushError(`Field in ${validation} is not valid or does not exist in ${validation}. So, empty string will be given as result`)
            return '';
        }

        if(typeof structure[validation.field] == "undefined") {
            this.pushError(`Field in ${validation} is not valid or does not exist in ${validation}. So, empty string will be given as result`)
            return '';
        }
        
        return this.applyProperlyProps(structure[validation.field], validation.property);

    }

    protected applyProperlyProps(field: any, prop?: Array<string>): any {

        if(!prop) 
            return this.getField(field)

        prop.forEach(eachProp => {

            if(typeof field[eachProp] == "undefined") {
                this.pushError(`Property ${eachProp} does not exist in ${field}. So, empty string will be given as result`)
                return '';
            }
            
            field = this.getField(field[eachProp]);
            return;
        
        })

        return field;
    }

    protected getField(field: any): any {

        if(typeof field !== 'function')
            return field;

        return field();
    }

    protected filterTarget(structure: any, validation: ValidationStandard): string {

        if(typeof validation.target !== "string") {
            this.pushError(`Target ${validation.target} is not valid or does not exist. So, empty string will be given as result`)
            return '';
        }

        let target: any = this.checkIfPropOrNot(validation.target);
      
        if(!validation.type && validation.operator.includes('strict')) {
            this.pushError(`Strict comparison must be done using types`)
            return '';
        } 
        
        if(validation.type) 
            target = this.transformTo(target, validation.type)
        
        if(validation.property_target) {
        
            target = this.applyProperlyProps(target, validation.property_target);
0
        }

        return target;

    }

    protected checkIfPropOrNot(target: string): string {
       
        if(!target.includes('prop:')) 
            return target

        let prop = target.split('prop:')[1].trim();
        return this.applyProperlyProps(target, [prop])

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

            default: 
                return String(srt);
        }

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
                this.pushError(`This ${operator} does not exist or not coded: read the documentation. So, false will be returned`)
                return false;
        }

    }

    protected pushError(error: string) {

        return this.runtimeErrors.error.push(error);

    }

}

export default Condition;