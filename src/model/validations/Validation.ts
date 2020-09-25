import ValidationPriority from '../../interfaces/validations/secundary/ValidationPriority';
import Validation_interface from '../../interfaces/validations/Validation'
import Condition from './Condition';

class Validation extends Condition implements Validation_interface {
    
    public property?: Array<string>
    public field: string

    constructor(field: string
        , property?: Array<string>
        , relationship?: string
        , validation?: ValidationPriority) {

            super(relationship, validation);
            this.field = field;
            this.property = property;

    }

}

export default Validation;