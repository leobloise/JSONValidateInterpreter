import applyFuncValidation from '../primary/applyFuncValidation';
import commonValidation from '../primary/commonValidation'
import logicValidation from './logicValidation'
import setValidation from '../../setValidation';

interface validationPriority {

    operator: string,
    validations: Array< commonValidation | logicValidation | setValidation | applyFuncValidation >

}

export default validationPriority;