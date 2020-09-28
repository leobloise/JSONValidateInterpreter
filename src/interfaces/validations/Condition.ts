import resultFromValidator from "../resultFromValidator";
import ValidationPriority from "./secundary/ValidationPriority";

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