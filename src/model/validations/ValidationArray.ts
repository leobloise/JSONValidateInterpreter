import ArrayValidation from "../../interfaces/validations/primary/ArrayValidation";
import ValidationPriority from "../../interfaces/validations/secundary/ValidationPriority";
import ValidationStandard from "./ValidationStandard";

class ValidationArray extends ValidationStandard implements ArrayValidation {

    public loops: string | number;

    constructor(loops: string | number, field: string, operator: string, target: string,
        property?: Array<string>, property_target?: Array<string>,
        type?: string, relationship?: string, validation?: ValidationPriority) {

        super(field, operator, target, property, property_target, type, relationship, validation)
        this.loops = loops;
        Object.freeze(this);
    }
}

export default ValidationArray;