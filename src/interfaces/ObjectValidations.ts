import logicValidation from "./validations/secundary/LogicValidation";
import StandardValidation from "./validations/primary/StandardValidation";
import FuncValidation from "./validations/primary/FuncValidation";
import ArrayValidation from "./validations/primary/ArrayValidation";

interface ObjectValidations {
    validations: Array< StandardValidation | FuncValidation | ArrayValidation | logicValidation>
}

export default ObjectValidations;