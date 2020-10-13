"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ContextStruct_1 = __importDefault(require("./ContextStruct"));
class ValidationsObject {
    constructor(validations) {
        this.validations = this.transformAllValidationsToObject(validations);
    }
    transformAllValidationsToObject(validations) {
        let tempArray = [];
        for (let prop in validations) {
            let validation = validations[prop];
            let kind = validation.kind;
            let validationObject = ContextStruct_1.default(kind, validation);
            tempArray.push(validationObject);
        }
        return tempArray;
    }
    get validationsTransformed() {
        return this.validations;
    }
}
exports.default = ValidationsObject;
