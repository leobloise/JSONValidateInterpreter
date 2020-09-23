import applyFuncValidation from './applyFuncValidation';
import commonValidation from './commonValidation';
import setValidation from './setValidation';
import validationPriority from './validationPriority'

interface logicValidation {
    relationship?: string,
    operator: string,
    condition1: commonValidation | logicValidation | setValidation | applyFuncValidation,
    condition2: commonValidation | logicValidation | setValidation | applyFuncValidation,
    validation?: validationPriority,
    res?: string

}

export default logicValidation;