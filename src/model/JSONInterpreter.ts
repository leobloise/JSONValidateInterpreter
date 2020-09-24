import applyFuncValidation from "../interfaces/applyFuncValidation";
import commonValidation from "../interfaces/commonValidation";
import logicValidation from "../interfaces/logicValidation";
import runtimeErrorObject from "../interfaces/runtimeErrorObject";
import validationPriority from "../interfaces/validationPriority";
import validation_general from "../interfaces/validation_general";
import Result from "../helper/Result";
import CommonValidator from "./CommonValidator";
import LogicValidator from "./LogicValidator";
import PremadeValidator from "./PremadeValidator";
import PriorityValidator from "./PriorityValidator";

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

    public teste() {
        
        let conditions = this.getAllConditionsFromJson();

        let result: any = {}
        
        for(let validation in conditions ) {
        
            result[validation] = this.result([this.createCondition(conditions[validation])]);
        
        }
    
        return {
            result:result,
            errors: this.runtimeError.error
        };
    }   

    private getAllConditionsFromJson() {
        
        let allConditions: any = {}

        for(let validation in this._json) {

            allConditions[validation] = (this._json[validation])

        }

        return allConditions;

    }

    /**
     * @method createCondition
     * @param validations 
     * @summary Method that execute all conditions and get the result
     */

    public createCondition(validations: validation_general ): Array<Array<boolean | string>> {

        let conditionsSolved: any = {
            conditions: []
        }
    
        validations.validations.forEach(validation => { 

            if(validation.validation) {

                let response = new PriorityValidator(validation.validation as validationPriority, this._object).result
                conditionsSolved['conditions'].push(response.result);
                this.getAllErros(response);

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

        })

        return conditionsSolved;
    }

    private getAllErros(response: any) {

        response.errors.forEach((error: string) => {
            this.runtimeError.error.push(error)
        })

    }

}

export default JSONInterpreter;