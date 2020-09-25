import Evalueter from "../helper/Evalueter";
import logicValidation from "../interfaces/validations/secundary/logicValidation";
import resultFromValidator from "../interfaces/resultFromValidator";
import ValidationClass from "../interfaces/Validation";
import validation_general from "../interfaces/validation_general";
import JSONInterpreter from "./JSONInterpreter";
import Validator from "./Validator";

class LogicValidator extends Validator implements ValidationClass {

    constructor(objectValidation: logicValidation, object: any) {
        super(objectValidation, object);
    }

    get result(): resultFromValidator {

        let validation = this.objectValidation as logicValidation;
        
        let validationObject: any = {
            'and': () => {
                let result = this.logicAndConditions(validation)
                let readyForReturn = this.checkRelationship(result, validation)
                
                return {
                    result: readyForReturn,
                    errors: this.runtimeError.error
                }
            },
            'or': () => {
                let result = this.logicOrConditions(validation)
                let readyForReturn = this.checkRelationship(result, validation)
                
                return {
                    result: readyForReturn,
                    errors: this.runtimeError.error
                } as resultFromValidator;
            }
        }

        if(typeof validationObject[validation.operator] !== "function") {

            this.runtimeError.error.push(`This operator: ${validation.operator} does not exist`)

            return {
                result: [false],
                errors: this.runtimeError.error
            };
        }

        return validationObject[validation.operator]();
    }

    private conditionGeneralLogic(validation: any) {

        let quantityValidations = this.verifyIfQuantityIsCorrectAndGetIt(validation);

        let logicConditions = []

        for(let i = 1; i <= quantityValidations; i++) {

            let condition: string = 'condition'+String(i);
           
            logicConditions.push(new JSONInterpreter(this.object, this.objectValidation).createCondition(
                {
                    validations: [validation[condition]]
                } as validation_general))
        }

        return this.calcAndTranslateResultFromConditions(logicConditions)

    }

    private logicAndConditions(validation: logicValidation) {

        let allValues = this.conditionGeneralLogic(validation)
        
        return [Boolean(allValues.reduce((acumulator: number, value) => {
            return acumulator *= Number(value[0])
        }, 1))];

    }

    private logicOrConditions(validation: logicValidation) {
	
        let allValues = this.conditionGeneralLogic(validation)

        return [Boolean(allValues.reduce((acumulator: number, value) => {
            return acumulator += Number(value[0])
        }, 0))];
    }

    private verifyIfQuantityIsCorrectAndGetIt(validation: logicValidation) {
        
        let quantityValidations = this.getQtdConditions(validation)

        if(quantityValidations < 2) {
            this.runtimeError.error.push(`There are not enough conditionals to do this validation: ${validation}`)
            return quantityValidations;
        }

        return quantityValidations
    
    }

    private getQtdConditions(validation: logicValidation) {

        let quantityValidations = 0;

        for(let condition in validation) {
            if(condition.includes('condition')) {
                quantityValidations++;
            }
        }

        return quantityValidations;
    }


}

export default LogicValidator;