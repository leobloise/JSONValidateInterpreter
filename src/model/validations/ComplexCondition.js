"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Condition_1 = __importDefault(require("./Condition"));
class ComplexCondition extends Condition_1.default {
    constructor(kind, operator, relationship, validation) {
        super(kind, relationship, validation);
        this.operator = this.checkRelationshipOperator(operator);
    }
    checkRelationshipOperator(operator) {
        let result = super.checkRelationship(operator);
        if (!result) {
            this.pushError(`This operator in: ${this.kind} must not be undefined. Or given`);
            return 'or';
        }
        return result;
    }
}
exports.default = ComplexCondition;
