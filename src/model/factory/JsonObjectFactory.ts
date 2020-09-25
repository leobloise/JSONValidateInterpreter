import Condition from "../../interfaces/validations/Condition";
import ArrayValidation from "../../interfaces/validations/primary/ArrayValidation";
import FuncValidation from "../../interfaces/validations/primary/FuncValidation";
import StandardValidation from "../../interfaces/validations/primary/StandardValidation";
import LogicValidations from "../validations/LogicValidations";
import PriorityValidations from "../validations/PriorityValidations";
import ValidationArray from "../validations/ValidationArray";
import ValidationFunc from "../validations/ValidationFunc";
import ValidationStandard from "../validations/ValidationStandard";
import ValidationsObject from "../ValidationsObject";

class JsonObjectFactory {

    private json: any;
    private struct: object = {

        "Standard": (obj: StandardValidation) => new ValidationStandard(obj.field, 
            obj.operator, 
            obj.target, 
            obj.property, 
            obj.property_target,
            obj.type,
            obj.relationship,
            obj.validation),
        
        "Array": (obj: ArrayValidation) => new ValidationArray(obj.loops, obj.field, 
            obj.operator, 
            obj.target, 
            obj.property, 
            obj.property_target,
            obj.type,
            obj.relationship,
            obj.validation),
        
        "Func": (obj: FuncValidation) => new ValidationFunc(obj.func, obj.field
            , obj.property
            , obj.relationship
            , obj.validation),

        "Priority": (obj: PriorityValidations) => new PriorityValidations(obj.validations,
            obj.operator, obj.relationship, obj.validation),
        
        "Logic": (obj: LogicValidations) => new LogicValidations(obj.conditions, obj.operator,
            obj.relationship, obj.validation)
    }

    constructor(json: any) {

        this.json = json;

    }

    get teste() {
        
        let arrayOfObjectValidations = [];

        for(let i in this.json) {
           
            arrayOfObjectValidations.push(new ValidationsObject(this.json[i] as any))

        }

    }
}

export default JsonObjectFactory;