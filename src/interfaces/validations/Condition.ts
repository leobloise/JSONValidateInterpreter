import resultFromValidator from "../resultFromValidator";
import ValidationPriority from "./secundary/validationPriority";

interface resultFunction {
    (structure: any): resultFromValidator;
}

interface Condition_interface {
    relationship?: string,
    validation?: ValidationPriority
    kind: string,
    result: resultFunction
}

export default Condition_interface;