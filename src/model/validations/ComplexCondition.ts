import ComplexCondition_interface from '../../interfaces/validations/ComplexCondition'
import ValidationPriority from '../../interfaces/validations/secundary/ValidationPriority';
import Condition from './Condition';

class ComplexCondition extends Condition implements ComplexCondition_interface {

    public operator: string;

    constructor(operator: string, relationship?: string, validation?: ValidationPriority) {

        super(relationship, validation);
        this.operator = operator;

    }

}

export default ComplexCondition;