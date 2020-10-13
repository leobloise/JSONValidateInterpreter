import ComplexCondition from '../ComplexCondition';
import LogicValidation from './logicValidation'
import StandardValidation from '../primary/StandardValidation';
import FuncValidation from '../primary/FuncValidation';
import ArrayValidation from '../primary/arrayValidation';
import Condition from '../../../model/validations/Condition';

interface ValidationPriority extends ComplexCondition{

    validations: Array< Condition >
    pos_validations: Array < Condition > 

}

export default ValidationPriority;