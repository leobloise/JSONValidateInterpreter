import applyFuncValidation from '../primary/applyFuncValidation';
import commonValidation from '../primary/commonValidation';
import setValidation from '../../setValidation';
import validationPriority from './validationPriority'
import arrayValidation from '../primary/arrayValidation';

interface logicValidation {
    
    relationship?: string,
    operator: string,
    condition1: commonValidation | logicValidation | setValidation | applyFuncValidation | arrayValidation,
    condition2: commonValidation | logicValidation | setValidation | applyFuncValidation | arrayValidation,
    validation?: validationPriority,

}

export default logicValidation;