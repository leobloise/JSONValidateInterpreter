import resultFromJsonObject from "../interfaces/resultFromJsonObject";
import resultFromValidator from "../interfaces/resultFromValidator";
import ValidationPriority from "../interfaces/validations/secundary/ValidationPriority";
import ValidationsObject from "./ValidationsObject";
interface validationStructure {

    [index: string]: any;

}


class ValidatorMachine {

    private structure: validationStructure;

    constructor(structure: any, objValidations: resultFromJsonObject) {

        this.structure = structure;
        this.teste(objValidations)
    }


    teste(objValidations: resultFromJsonObject) {

        let resultObject = {}

        for(let validation in objValidations) {

            let validations = objValidations[validation];
            this.getResultFromValidations(validations);
        }

    }

    private getResultFromValidations(validations: ValidationsObject) {

        validations.validationsTransformed.forEach(validationActual => {
            let result = validationActual.result(this.structure);
            console.log(result.result);
        })

    }
}

export default ValidatorMachine;