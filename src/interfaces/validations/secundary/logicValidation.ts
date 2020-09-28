import ComplexCondition from '../ComplexCondition';
import Condition from '../../../model/validations/Condition';

interface LogicCondition_interface extends ComplexCondition {
    
    conditions: Array< Condition | ComplexCondition > 

}

export default LogicCondition_interface;