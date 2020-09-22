import applyFuncValidation from "./applyFuncValidation";
import commonValidation from "./commonValidation";
import logicValidation from "./logicValidation";
import setValidation from "./setValidation";

interface validation_general {
    validations: Array< commonValidation | applyFuncValidation | logicValidation | setValidation >
}

export default validation_general;