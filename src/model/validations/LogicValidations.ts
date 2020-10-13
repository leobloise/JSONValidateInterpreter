import ComplexCondition from "./ComplexCondition";
import LogicValidations_interface from '../../interfaces/validations/secundary/logicValidation'
import Condition from "./Condition";
import ValidationPriority from "../../interfaces/validations/secundary/validationPriority";
import resultFromValidator from "../../interfaces/resultFromValidator";
import ValidationsObject from "../ValidationsObject";

class LogicValidations extends ComplexCondition implements LogicValidations_interface {

    public conditions: Array< Condition | ComplexCondition>;

    constructor(kind: string,conditions: Array< Condition >, operator: string, relationship?: string, validation?: ValidationPriority) {

        super(kind, operator, relationship, validation);
        this.conditions = this.treateAllConditions(conditions);
        Object.freeze(this);
        
    }

    private treateAllConditions(conditions: Array< Condition >) {

        let conditionsTreated = new ValidationsObject(conditions).validationsTransformed;
        return conditionsTreated;
    }

    public result(structure: any): resultFromValidator {

        let validationObject: any = {
            '*': () => {
                let arrayOfResult = this.conditionGeneralLogic(structure);

                let reduced = arrayOfResult.reduce((acumulator: number, value: any) => {
                    return acumulator *= Number(value[0]);
                }, 1)
            
                let readyForReturn = this.pushRelationship([Boolean(reduced)])

                return {
                    result: readyForReturn,
                    errors: this.runtimeErrors.error
                }
            },
            '+': () => {
                let arrayOfResult = this.conditionGeneralLogic(structure);

                let reduced = arrayOfResult.reduce((acumulator: number, value: any) => {
                    return acumulator += Number(value[0]);
                }, 0)

                let readyForReturn = this.pushRelationship([Boolean(reduced)]);
    
                return {
                    result: readyForReturn,
                    errors: this.runtimeErrors.error
                }
            }
        }


        return validationObject[this.operator]();
    }

    private conditionGeneralLogic(structure: any) {

        let arrayOfResult: Array<Array<boolean | string>> = [];

        this.conditions.forEach(condition => {
            arrayOfResult.push(condition.result(structure).result);
        })

        return arrayOfResult;
    }

} 

export default LogicValidations;