"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ObjectJson_1 = __importDefault(require("../ObjectJson"));
class JsonObjectFactory {
    constructor(json) {
        this.json = json;
    }
    get jsonObjects() {
        let arrayOfObjectValidations = {};
        for (let i in this.json) {
            arrayOfObjectValidations[i] = this.json[i];
        }
        return new ObjectJson_1.default(arrayOfObjectValidations);
    }
}
exports.default = JsonObjectFactory;
