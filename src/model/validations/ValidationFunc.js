"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const CommonValidations_1 = __importDefault(require("../../helper/CommonValidations"));
const Validation_1 = __importDefault(require("./Validation"));
class ValidationFunc extends Validation_1.default {
    constructor(kind, func, field, property, relationship, validation) {
        super(kind, field, property, relationship, validation);
        this.commonValidations = (field, operation) => {
            let realCommonValidations = new CommonValidations_1.default(field);
            if (typeof realCommonValidations[operation] !== 'function') {
                this.pushError(`This operation ${operation} does not exist in CommonValidations. Empty string given`);
                return '';
            }
            return realCommonValidations[operation]();
        };
        this.func = func;
        Object.freeze(this);
    }
    result(structure) {
        let object = this.filterField(structure, this);
        let result = [this.commonValidations(object, this.func)];
        result = this.pushRelationship(result);
        return {
            result: result,
            errors: this.runtimeErrors.error
        };
    }
}
exports.default = ValidationFunc;
