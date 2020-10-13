"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const LogicValidations_1 = __importDefault(require("./validations/LogicValidations"));
const PriorityValidations_1 = __importDefault(require("./validations/PriorityValidations"));
const ValidationArray_1 = __importDefault(require("./validations/ValidationArray"));
const ValidationFunc_1 = __importDefault(require("./validations/ValidationFunc"));
const ValidationStandard_1 = __importDefault(require("./validations/ValidationStandard"));
const struct = {
    "Standard": (obj) => {
        return new ValidationStandard_1.default(obj.kind, obj.field, obj.operator, obj.target, obj.property, obj.property_target, obj.type, obj.relationship, obj.validation);
    },
    "Array": (obj) => new ValidationArray_1.default(obj.kind, obj.loops, obj.field, obj.operator, obj.target, obj.property, obj.property_target, obj.type, obj.relationship, obj.validation),
    "Func": (obj) => new ValidationFunc_1.default(obj.kind, obj.func, obj.field, obj.property, obj.relationship, obj.validation),
    "Priority": (obj) => {
        if (!obj.validation) {
            throw new Error('Elementos faltando para validação desse tipo: ' + obj.kind);
        }
        else {
            let validation = obj.validation;
            return new PriorityValidations_1.default(validation.kind, validation.validations, validation.pos_validations, validation.operator, validation.relationship, validation.validation);
        }
    },
    "Logic": (obj) => new LogicValidations_1.default(obj.kind, obj.conditions, obj.operator, obj.relationship, obj.validation)
};
function getValidationObjectUsingContext(kind, validation) {
    if (!struct[kind])
        throw new Error('Esse tipo de condição não existe');
    return struct[kind](validation);
}
exports.default = getValidationObjectUsingContext;
