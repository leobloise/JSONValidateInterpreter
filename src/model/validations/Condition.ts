import Condition_interface from "../../interfaces/validations/Condition";
import ValidationPriority from "../../interfaces/validations/secundary/ValidationPriority";

class Condition implements Condition_interface {

    public relationship?: string;
    public validation?: ValidationPriority;

    constructor(relationship?: string, validation?: ValidationPriority) {
        this.validation = validation;
        this.relationship = relationship;
    }

}

export default Condition;