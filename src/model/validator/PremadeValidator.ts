import applyFuncValidation from "../interfaces/validations/primary/applyFuncValidation";
import Validator from "./Validator";

import ValidationClass from '../interfaces/Validation'
import resultFromValidator from "../interfaces/resultFromValidator";

class PremadeValidator extends Validator implements ValidationClass {
    
    constructor(objectValidation: applyFuncValidation, object: any){
        super(objectValidation, object)
    }

    get result(): resultFromValidator {

        let validation = this.objectValidation as applyFuncValidation;
        
		let object = this.filterField(validation);
            
        let result = [this.commonValidations(object, validation.func)]
        
        result = this.checkRelationship(result, validation);

        return {
            result: result,
            errors: this.runtimeError.error
        }
    
    }
}

export default PremadeValidator;