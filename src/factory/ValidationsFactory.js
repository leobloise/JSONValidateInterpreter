"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const JsonObjectFactory_1 = __importDefault(require("../model/factory/JsonObjectFactory"));
const ValidatorMachine_1 = __importDefault(require("../model/ValidatorMachine"));
class ValidationsFactory {
    static validations(structure, json) {
        if (typeof json == 'string') {
            json = JSON.parse(json);
        }
        let allJsonToOjbect = new JsonObjectFactory_1.default(json).jsonObjects;
        let allConditionsToObject = allJsonToOjbect.objectValidationsFromJson;
        let validatorMachine = new ValidatorMachine_1.default(structure, allConditionsToObject).result;
        let result = {};
        for (let validation in validatorMachine) {
            let insideValidation = validatorMachine[validation];
            let allTogether = insideValidation.reduce((acumulator, validation) => {
                return {
                    errors: acumulator.errors.concat(validation.errors),
                    result: acumulator.result.concat(validation.result)
                };
            }, {
                errors: [],
                result: []
            });
            result[validation] = allTogether;
        }
        return result;
    }
}
exports.default = ValidationsFactory;
