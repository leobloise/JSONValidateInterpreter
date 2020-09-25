import ComplexCondition from "./ComplexCondition";

import LogicValidations_interface from '../../interfaces/validations/secundary/LogicValidation'
import Condition from "./Condition";
import ValidationPriority from "../../interfaces/validations/secundary/ValidationPriority";

class LogicValidations extends ComplexCondition implements LogicValidations_interface {

    public conditions: Array< Condition >;

    constructor(conditions: Array< Condition >, operator: string, relationship?: string, validation?: ValidationPriority) {

        super(operator, relationship, validation);
        this.conditions = conditions;
        Object.freeze(this);
        
    }
} 

export default LogicValidations;