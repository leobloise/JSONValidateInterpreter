import ObjectValidations from "../interfaces/ObjectValidations";
import ArrayValidation from "../interfaces/validations/primary/ArrayValidation";
import FuncValidation from "../interfaces/validations/primary/FuncValidation";
import StandardValidation from "../interfaces/validations/primary/StandardValidation";
import LogicCondition from "../interfaces/validations/secundary/LogicValidation";

class ValidationsObject implements ObjectValidations {

    public validations: Array< StandardValidation | FuncValidation | ArrayValidation | LogicCondition>

    constructor(validations: Array< StandardValidation | FuncValidation | ArrayValidation | LogicCondition>) {
        this.validations = validations;
    }

}

export default ValidationsObject;