"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ValidationsObject_1 = __importDefault(require("./ValidationsObject"));
class JsonObject {
    constructor(json) {
        this.objectValidations = json;
    }
    get objectValidationsFromJson() {
        let resultado = {};
        for (let validation in this.objectValidations) {
            resultado[validation] = new ValidationsObject_1.default(this.objectValidations[validation].validations);
        }
        return resultado;
    }
}
exports.default = JsonObject;
