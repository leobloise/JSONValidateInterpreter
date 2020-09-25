import applyFuncValidation from "../interfaces/validations/primary/applyFuncValidation";
import commonValidation from "../interfaces/validations/primary/commonValidation";
import logicValidation from "../interfaces/validations/secundary/logicValidation";
import runtimeErrorObject from "../interfaces/runtimeErrorObject";
import validationPriority from "../interfaces/validations/secundary/validationPriority";
import validation_general from "../interfaces/validation_general";
import Result from "../helper/Result";
import CommonValidator from "./validator/CommonValidator";
import LogicValidator from "./validator/LogicValidator";
import PremadeValidator from "./validator/PremadeValidator";
import PriorityValidator from "./validator/PriorityValidator";
import resultFromValidator from "../interfaces/resultFromValidator";
import Validator from "./validator/Validator";
import ArrayValidator from "./validator/ArrayValidator";
import arrayValidation from "../interfaces/validations/primary/arrayValidation";

interface allValidations {
    [index: string]: validation_general
}

class JSONInterpreter {

    private _object: any;
    private _json: any;
    private runtimeError: runtimeErrorObject = {
        error: []
    }
    private result: Function = (result: Array<Array<Array<boolean|string>>>) => {
    
        let realResult = new Result(result).result;
    
        return realResult;
    
    }

    constructor(object: any, json: any) {

        this._object = object;

        this._json = json

    }

    get conditions() {
        
        let conditions = this.getAllConditionsFromJson();

        let result: any = {}
        
        for(let validation in conditions ) {
            result[validation] = this.result([this.createCondition(conditions[validation])]);
        
        }
    
        return {
            result: result,
            errors: this.runtimeError.error
        };
    }   

    private getAllConditionsFromJson() {
        
        let allConditions: allValidations = {}

        for(let validation in this._json) {

            allConditions[validation] = (this._json[validation]) as validation_general
        
        }

        return allConditions;

    }

    /**
     * @method createCondition
     * @param validations 
     * @summary Method that execute all conditions and get the result
     */

    public createCondition(validations: any ): Array<Array<boolean | string>> {

        let conditionsSolved: any = {
            conditions: []
        }

        validations.validations.forEach((validation: any) => { 
            console.log(validation)
            if(validation.validation) {

                let response = new PriorityValidator(validation.validation as validationPriority, this._object).result
                conditionsSolved['conditions'].push(response.result);
                this.getAllErros(response);

            } 

            if(validation.loops) {
                
                let response = new ArrayValidator(validation as arrayValidation, this._object).result;
                console.log(response)
                conditionsSolved['conditions'].push(response.result)
                this.getAllErros(response);
                return;
            }

            if(validation.func) {

                let response = new PremadeValidator(validation as applyFuncValidation, this._object).result
                conditionsSolved['conditions'].push(response.result);
                this.getAllErros(response);
                return;

            }

            if(validation.operator == "or" || validation.operator == "and") {

                let response = new LogicValidator(validation as logicValidation, this._object).result;
                conditionsSolved['conditions'].push(response.result);
                this.getAllErros(response);
                return;

            }

            let response = new CommonValidator(validation as commonValidation, this._object).result;
            conditionsSolved['conditions'].push(response.result);
            this.getAllErros(response);
            return;
        })

        return conditionsSolved;
    }

    private getAllErros(response: resultFromValidator) {

        response.errors.forEach((error: string) => {
            this.runtimeError.error.push(error)
        })

    }

}

export default JSONInterpreter;