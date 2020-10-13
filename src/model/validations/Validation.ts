import ValidationPriority from '../../interfaces/validations/secundary/validationPriority';
import Validation_interface from '../../interfaces/validations/Validation'
import Condition from './Condition';

class Validation extends Condition implements Validation_interface {
    
    public property?: Array<string>
    public field: string

    constructor(kind: string, field: string
        , property?: Array<string>
        , relationship?: string
        , validation?: ValidationPriority) {

            super(kind, relationship, validation);
            this.field = field;
            this.property = property;

    }

}

export default Validation;