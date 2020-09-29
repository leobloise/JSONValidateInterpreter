import CommonValidations from "../../helper/CommonValidations";
import resultFromValidator from "../../interfaces/resultFromValidator";
import FuncValidation from "../../interfaces/validations/primary/FuncValidation";
import ValidationPriority from "../../interfaces/validations/secundary/validationPriority";
import Validation from "./Validation";

class ValidationFunc extends Validation implements FuncValidation {

    public func: string;
    public commonValidations: Function = (field: any, operation: string) => {
            
        let realCommonValidations: any = new CommonValidations(field);
        
        if(typeof realCommonValidations[operation] !== 'function'){
            this.pushError(`This operation ${operation} does not exist in CommonValidations. Empty string given`);
            return '';
        }

        return realCommonValidations[operation]();
    }

    constructor(kind: string, func: string, field: string,
        property?: Array<string>, relationship?: string, validation?: ValidationPriority) {

       super(kind, field, property, relationship, validation);
            this.func = func;
            Object.freeze(this);
    }

    public result(structure: any): resultFromValidator {
        
		let object = this.filterField(structure, this);
            
        let result: Array<boolean | string> = [this.commonValidations(object, this.func)]
        
        result = this.pushRelationship(result);

        return {
            result: result,
            errors: this.runtimeErrors.error
        }
    
    }

}

export default ValidationFunc;