import applyFuncValidation from './applyFuncValidation';
import commonValidation from './commonValidation'
import logicValidation from './logicValidation'
import setValidation from './setValidation';

interface validationPriority {

    operator: string,
    validations: Array< commonValidation | logicValidation | setValidation | applyFuncValidation >

}

export default validationPriority;