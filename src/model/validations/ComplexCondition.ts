import ComplexCondition_interface from '../../interfaces/validations/ComplexCondition'
import ValidationPriority from '../../interfaces/validations/secundary/validationPriority';
import Condition from './Condition';

class ComplexCondition extends Condition implements ComplexCondition_interface {

    public operator: string;

    constructor(kind: string, operator: string, relationship?: string, validation?: ValidationPriority) {

        super(kind, relationship, validation);
        
        this.operator = this.checkRelationshipOperator(operator);

    }

    protected checkRelationshipOperator(operator: string) {

        let result = super.checkRelationship(operator);
    
        if(!result) {

            this.pushError(`This operator in: ${this.kind} must not be undefined. Or given`)
            return 'or';
        }

        return result;
    }

}

export default ComplexCondition;