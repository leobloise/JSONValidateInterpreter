import ArrayValidation from "../interfaces/validations/primary/arrayValidation";
import FuncValidation from "../interfaces/validations/primary/FuncValidation";
import StandardValidation from "../interfaces/validations/primary/StandardValidation";
import ComplexCondition from "./validations/ComplexCondition";
import Condition from "./validations/Condition";
import LogicValidations from "./validations/LogicValidations";
import PriorityValidations from "./validations/PriorityValidations";
import ValidationArray from "./validations/ValidationArray";
import ValidationFunc from "./validations/ValidationFunc";
import ValidationStandard from "./validations/ValidationStandard";

interface context {

    [index: string]: Function

}

const struct: context = {

    "Standard": (obj: StandardValidation) => {
        return new ValidationStandard(obj.kind, obj.field, 
        obj.operator, 
        obj.target, 
        obj.property, 
        obj.property_target,
        obj.type,
        obj.relationship,
        obj.validation)
    },
    
    "Array": (obj: ArrayValidation) => new ValidationArray(obj.kind,obj.loops, obj.field, 
        obj.operator, 
        obj.target, 
        obj.property, 
        obj.property_target,
        obj.type,
        obj.relationship,
        obj.validation),
    
    "Func": (obj: FuncValidation) => new ValidationFunc(obj.kind, obj.func, obj.field
        , obj.property
        , obj.relationship
        , obj.validation),

    "Priority": (obj: Condition) => {
        
        if(!obj.validation) {
            throw new Error('Elementos faltando para validação desse tipo: ' + obj.kind);
        }
            
        else {
            let validation = obj.validation as PriorityValidations;
            return  new PriorityValidations(validation.kind, validation.validations , validation.pos_validations,
                validation.operator, validation.relationship, validation.validation)
        }   
    },
    
    "Logic": (obj: LogicValidations) => new LogicValidations(obj.kind, obj.conditions, obj.operator,
        obj.relationship, obj.validation)
        
}

export default function getValidationObjectUsingContext(kind: string, validation: Condition | ComplexCondition): Condition  {

    if(!struct[kind])
        throw new Error('Esse tipo de condição não existe')

    return struct[kind](validation);

}