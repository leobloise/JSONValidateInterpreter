import applyFuncValidation from "./validations/primary/applyFuncValidation";
import commonValidation from "./validations/primary/commonValidation";
import logicValidation from "./validations/secundary/logicValidation";
import setValidation from "./setValidation";

interface validation_general {
    validations: Array< commonValidation | applyFuncValidation | logicValidation | setValidation >
}

export default validation_general;