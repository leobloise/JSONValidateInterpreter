"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ValidatorMachine {
    constructor(structure, objValidations) {
        this.structure = structure;
        this.objValidations = objValidations;
    }
    get result() {
        return this.getAllValidations(this.objValidations);
    }
    getAllValidations(objValidations) {
        let resultObject = {};
        for (let validation in objValidations) {
            let validations = objValidations[validation];
            resultObject[validation] = this.getResultFromValidations(validations);
        }
        return resultObject;
    }
    getResultFromValidations(validations) {
        let arrayOfResult = [];
        validations.validationsTransformed.forEach(validationActual => {
            let result = validationActual.result(this.structure);
            arrayOfResult.push(result);
        });
        return arrayOfResult;
    }
}
exports.default = ValidatorMachine;
