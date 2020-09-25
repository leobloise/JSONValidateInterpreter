import FuncValidation from "../../interfaces/validations/primary/FuncValidation";
import ValidationPriority from "../../interfaces/validations/secundary/ValidationPriority";
import Validation from "./Validation";

class ValidationFunc extends Validation implements FuncValidation {

    public func: string;
    
    constructor(func: string, field: string,
        property?: Array<string>, relationship?: string, validation?: ValidationPriority) {

       super(field, property, relationship, validation);
            this.func = func;
            Object.freeze(this);
    }

}

export default ValidationFunc;