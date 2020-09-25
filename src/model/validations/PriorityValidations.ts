import ValidationPriority from "../../interfaces/validations/secundary/ValidationPriority";
import ComplexCondition from "./ComplexCondition";
import Condition from "./Condition";

class PriorityValidations extends ComplexCondition implements ValidationPriority {

    public validations: Array< Condition >;

    constructor(validations: Array< Condition >, operator: string, relationship?: string, validation?: PriorityValidations) {
        super(operator, relationship, validation);
        this.validations = validations
        Object.freeze(this);
    }

}


export default PriorityValidations;