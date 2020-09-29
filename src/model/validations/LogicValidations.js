"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ComplexCondition_1 = __importDefault(require("./ComplexCondition"));
const ValidationsObject_1 = __importDefault(require("../ValidationsObject"));
class LogicValidations extends ComplexCondition_1.default {
    constructor(kind, conditions, operator, relationship, validation) {
        super(kind, operator, relationship, validation);
        this.conditions = this.treateAllConditions(conditions);
        Object.freeze(this);
    }
    treateAllConditions(conditions) {
        let conditionsTreated = new ValidationsObject_1.default(conditions).validationsTransformed;
        return conditionsTreated;
    }
    result(structure) {
        let validationObject = {
            '*': () => {
                let arrayOfResult = this.conditionGeneralLogic(structure);
                let reduced = arrayOfResult.reduce((acumulator, value) => {
                    return acumulator *= Number(value[0]);
                }, 1);
                let readyForReturn = this.pushRelationship([Boolean(reduced)]);
                return {
                    result: readyForReturn,
                    errors: this.runtimeErrors.error
                };
            },
            '+': () => {
                let arrayOfResult = this.conditionGeneralLogic(structure);
                let reduced = arrayOfResult.reduce((acumulator, value) => {
                    return acumulator += Number(value[0]);
                }, 0);
                let readyForReturn = this.pushRelationship([Boolean(reduced)]);
                return {
                    result: readyForReturn,
                    errors: this.runtimeErrors.error
                };
            }
        };
        return validationObject[this.operator]();
    }
    conditionGeneralLogic(structure) {
        let arrayOfResult = [];
        this.conditions.forEach(condition => {
            arrayOfResult.push(condition.result(structure).result);
        });
        return arrayOfResult;
    }
}
exports.default = LogicValidations;
