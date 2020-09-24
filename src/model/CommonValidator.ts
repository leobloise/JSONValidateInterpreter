import commonValidation from "../interfaces/commonValidation";
import resultFromValidator from "../interfaces/resultFromValidator";
import ValidationClass from "../interfaces/Validation";
import Validator from "./Validator";

class CommonValidator extends Validator implements ValidationClass{

    constructor(objectValidation: commonValidation, object: any) {
        super(objectValidation, object)
    }

    get result() {
        
        let validation = this.objectValidation as commonValidation
        
        let operator = validation.operator;
        let field = this.filterField(validation);
        
        let target = this.filterTarget(validation);
        
        return {
            result: this.checkRelationship([this.getConditionResult(field, operator, target)], validation),
            errors: this.runtimeError.error
        } as resultFromValidator;
    }

}

export default CommonValidator