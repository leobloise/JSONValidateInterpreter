import Result from "../helper/Result";
import resultFromJsonObject from "../interfaces/resultFromJsonObject";
import resultFromValidator from "../interfaces/resultFromValidator";
import resultFromValidatorMachine from "../interfaces/validations/Result";
import validationResult from "../interfaces/validations/validationResult";
import ValidationsObject from "./ValidationsObject";

interface validationStructure {

    [index: string]: any;

}


class ValidatorMachine {

    private structure: validationStructure;
    private objValidations: any;

    constructor(structure: any, objValidations: resultFromJsonObject) {

        this.structure = structure;
        this.objValidations = objValidations
    }

    get result(): resultFromValidatorMachine {
        return this.getAllValidations(this.objValidations)
    }


    private getAllValidations(objValidations: resultFromJsonObject) {

        let resultObject: resultFromValidatorMachine = {}

        for(let validation in objValidations) {

            let validations = objValidations[validation];
            
            resultObject[validation] = this.getResultFromValidations(validations);

        }

        return resultObject;

    }

    private getResultFromValidations(validations: ValidationsObject): validationResult {

        let arrayOfResult: Array<any> = []

        validations.validationsTransformed.forEach(validationActual => {

            let result = validationActual.result(this.structure);
            arrayOfResult.push(result);
        })

        

        return arrayOfResult as validationResult;

    }
}

export default ValidatorMachine;