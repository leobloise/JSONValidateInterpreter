import StandardValidation from "../../interfaces/validations/primary/StandardValidation";
import ValidationPriority from "../../interfaces/validations/secundary/ValidationPriority";
import Validation from "./Validation";

class ValidationStandard extends Validation implements StandardValidation {

    public operator: string;
    public property_target?: Array<string>;
    public type?: string
    public target: string
    
    constructor(field: string, operator: string, target: string,
        property?: Array<string>, property_target?: Array<string>,
        type?: string, relationship?: string, validation?: ValidationPriority) {

            super(field, property, relationship, validation)
            this.operator = operator;
            this.property_target = property_target;
            this.target = target;
            this.type = type;

    }

}

export default ValidationStandard;