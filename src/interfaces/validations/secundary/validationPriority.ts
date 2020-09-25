import ComplexCondition from '../ComplexCondition';
import LogicValidation from './LogicValidation'
import StandardValidation from '../primary/StandardValidation';
import FuncValidation from '../primary/FuncValidation';
import ArrayValidation from '../primary/ArrayValidation';
import Condition from '../../../model/validations/Condition';

interface ValidationPriority extends ComplexCondition{

    validations: Array< Condition >

}

export default ValidationPriority;