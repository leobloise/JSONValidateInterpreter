import ObjectValidations from "../interfaces/ObjectValidations";
import ComplexCondition from "./validations/ComplexCondition";
import Condition from "./validations/Condition";
import getValidationObjectUsingContext from './ContextStruct';

class ValidationsObject implements ObjectValidations {

    public validations: Array< Condition | ComplexCondition >


    constructor(validations: Array< Condition | ComplexCondition >) {
        this.validations = this.transformAllValidationsToObject(validations)
    }

    private transformAllValidationsToObject(validations: Array< Condition | ComplexCondition > ): Array< Condition | ComplexCondition >  {

        
        let tempArray: Array< Condition | ComplexCondition > = []
        
        for(let prop in validations) {
            
            let validation = validations[prop];
            let kind = validation.kind;
            
            let validationObject = getValidationObjectUsingContext(kind, validation)
    
            tempArray.push(validationObject)

        }

        return tempArray;

    } 

    get validationsTransformed() {

        return this.validations;

    }


}

export default ValidationsObject;