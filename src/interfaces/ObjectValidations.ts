import logicValidation from "./validations/secundary/logicValidation";
import StandardValidation from "./validations/primary/StandardValidation";
import FuncValidation from "./validations/primary/FuncValidation";
import ArrayValidation from "./validations/primary/arrayValidation";
import Condition from "../model/validations/Condition";
import ComplexCondition from "../model/validations/ComplexCondition";
import Validation from "../model/validations/Validation";

interface ObjectValidations {
    validations: Array< StandardValidation | FuncValidation | ArrayValidation | logicValidation | Condition | ComplexCondition | Validation >
}

export default ObjectValidations;