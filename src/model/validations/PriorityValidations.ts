import Evalueter from "../../helper/Evalueter";
import Result from "../../helper/Result";
import resultFromValidator from "../../interfaces/resultFromValidator";
import ValidationPriority from "../../interfaces/validations/secundary/validationPriority";
import ValidationsObject from "../ValidationsObject";
import ComplexCondition from "./ComplexCondition";
import Condition from "./Condition";

class PriorityValidations extends ComplexCondition implements ValidationPriority {

    public validations: Array< Condition >;
    public pos_validations: Array < Condition >;

    constructor(kind: string, validations: Array< Condition >, pos_validations: Array < Condition >,operator: string, relationship?: string, validation?: ValidationPriority) {
        
        super(kind, operator, relationship, validation);
        
        this.validations = this.treatAllValidations(validations);
        this.pos_validations = this.treatAllValidations(pos_validations);

        Object.freeze(this);
    
    }

    private treatAllValidations(validations: Array< Condition >) {
        let treatedValidations = new ValidationsObject(validations);
        return treatedValidations.validationsTransformed;
    }

    public result(structure: any): resultFromValidator {
        
        let arrayOfResultAnt: Array<Array<string | boolean>> = this.generalLogicOfPriority(structure, this.validations);
        let arrayOfResultPos: Array<Array<string | boolean>> = this.generalLogicOfPriority(structure, this.pos_validations);

        arrayOfResultPos.forEach(result => {
            arrayOfResultAnt.push(result);
        })

        let reduced;

        if(this.operator === '*') {
            reduced = arrayOfResultAnt.reduce((acumulator: number, value: any) => {
                return acumulator *= Number(value[0]);
            }, 1)
        } else {
            reduced = arrayOfResultAnt.reduce((acumulator: number, value: any) => {
                return acumulator += Number(value[0]);
            }, 0)
        }
    
        let readyForReturn = this.pushRelationship([Boolean(reduced)]);

        return {
            result: readyForReturn,
            errors: this.runtimeErrors.error
        }


    }

    private generalLogicOfPriority(structure: any, validation: Array< Condition >) {

        let arrayOfResultAnt: Array<Array<string | boolean>> = [];

        validation.forEach(validationActual => {

            arrayOfResultAnt.push(validationActual.result(structure).result)

        })

        let resultado = new Result([{
            conditions: arrayOfResultAnt
        }]).result

        let evalUte = new Evalueter(resultado).evaluete;

        return evalUte;

    }

}


export default PriorityValidations;