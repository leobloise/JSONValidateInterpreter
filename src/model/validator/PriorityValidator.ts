import { Console } from "console";
import applyFuncValidation from "../interfaces/validations/primary/applyFuncValidation";
import resultFromValidator from "../interfaces/resultFromValidator";
import ValidationClass from "../interfaces/Validation";
import validationPriority from "../interfaces/validations/secundary/validationPriority";
import validation_general from "../interfaces/validation_general";
import JSONInterpreter from "./JSONInterpreter";
import Validator from "./Validator";

class PriorityValidator extends Validator implements ValidationClass {
    
    constructor(objectValidation: validationPriority, object: any) {
        super(objectValidation, object)
    }
 
    get result(): resultFromValidator {

        let validation = this.objectValidation as validationPriority;

        let results = [new JSONInterpreter(this.object, this.objectValidation).createCondition({
            validations: validation.validations 
        } as validation_general)]
        
        let realResult: Array<boolean | string> = this.calcAndTranslateResultFromConditions(results)[0]

        let relationship = validation.operator;

        realResult.push(this.getRelationship(relationship))

        return {
            result: realResult,
            errors: this.runtimeError.error
        };
    }

}

export default PriorityValidator;