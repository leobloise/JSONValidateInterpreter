"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ValidationsFactory_1 = __importDefault(require("./src/factory/ValidationsFactory"));
function getValidations(json, struct) {
    let objectJson = JSON.parse(json);
    let result = ValidationsFactory_1.default.validations(struct, objectJson);
    return result;
}
exports.default = getValidations;
