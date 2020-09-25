import arrayValidation from "../interfaces/validations/primary/arrayValidation";
import commonValidation from "../interfaces/validations/primary/commonValidation";
import resultFromValidator from "../interfaces/resultFromValidator";
import ValidationClass from "../interfaces/Validation";
import Validator from "./Validator";

interface loops {
    i: number,
    n: number 
}

class ArrayValidator extends Validator implements ValidationClass {

    constructor(objectValidation: arrayValidation , object: any) {
        super(objectValidation, object)
    }

    get result(): resultFromValidator {

        let validation = this.objectValidation as arrayValidation;

        let arrayFromjson = this.checkIfIsValidArray(validation)
        let target = this.filterTarget(validation as commonValidation);
        let loops: loops = this.filterLoops(validation, arrayFromjson);
        let props: Array<string> | undefined = this.getAllProps(validation);
        let result: number = 0;

        do {

            let field = arrayFromjson[loops.i]
            let fieldProper = this.applyProperlyProps(field, props)

            result += Number(this.getConditionResult(fieldProper, validation.operator, target));

            loops.i ++;

        } while(loops.i < loops.n)

        let treatedResult: Array<boolean | string> = [Boolean(result)]

        treatedResult = this.checkRelationship(treatedResult, validation);

        return {
            result: treatedResult,
            errors: this.runtimeError.error
        }
    }

    private checkIfIsValidArray(validation: arrayValidation): Array<any> {
        
        if(!validation.field) {
            this.runtimeError.error.push('Array was not given. So, empty array returned')
            return [];
        }

        if(typeof this.object[validation.field] !== "object") {
            this.runtimeError.error.push('Not valid array from object. So, empty array returned')
            return [];
        }
       
        return this.filterField(validation as commonValidation)

    }

    private filterLoops(validation: arrayValidation, arrayFromjson: Array<any>): loops {

        let all = arrayFromjson.length

        if(!validation.loops) {

            this.runtimeError.error.push('Loops was not given. So, all array quantity returned')
            return {
                i: 0,
                n: all
            };
        } 

        if(validation.loops == 'all')
            return {
                i: 0,
                n: all
            };
        
        if(validation.loops.toString().includes('num:')) {

            let numero = Number(validation.loops.toString().split('num:')[1].trim()) - 1 

            return {
                i: numero,
                n: numero + 1
            };
        }

        if(isNaN(Number(validation.loops))) {
            this.runtimeError.error.push('Loops invalid. So, all array quantity returned')
            return {
                i: 0,
                n: all
            };
        }

        if(!isNaN(Number(validation.loops))) {
            
            return {
                i: 0,
                n: Number(validation.loops)
            }
        }

        this.runtimeError.error.push('Invalid value recieved. So, all array quantity returned')

        return {
            i: 0,
            n: all
        };

    }

    private getAllProps(validation: arrayValidation) {
        
        return validation.property_item;

    }

}

export default ArrayValidator;