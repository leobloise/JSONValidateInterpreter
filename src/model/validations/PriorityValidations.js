"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Evalueter_1 = __importDefault(require("../../helper/Evalueter"));
const Result_1 = __importDefault(require("../../helper/Result"));
const ValidationsObject_1 = __importDefault(require("../ValidationsObject"));
const ComplexCondition_1 = __importDefault(require("./ComplexCondition"));
class PriorityValidations extends ComplexCondition_1.default {
    constructor(kind, validations, pos_validations, operator, relationship, validation) {
        super(kind, operator, relationship, validation);
        this.validations = this.treatAllValidations(validations);
        this.pos_validations = this.treatAllValidations(pos_validations);
        Object.freeze(this);
    }
    treatAllValidations(validations) {
        let treatedValidations = new ValidationsObject_1.default(validations);
        return treatedValidations.validationsTransformed;
    }
    result(structure) {
        let arrayOfResultAnt = this.generalLogicOfPriority(structure, this.validations);
        let arrayOfResultPos = this.generalLogicOfPriority(structure, this.pos_validations);
        arrayOfResultPos.forEach(result => {
            arrayOfResultAnt.push(result);
        });
        let reduced;
        if (this.operator === '*') {
            reduced = arrayOfResultAnt.reduce((acumulator, value) => {
                return acumulator *= Number(value[0]);
            }, 1);
        }
        else {
            reduced = arrayOfResultAnt.reduce((acumulator, value) => {
                return acumulator += Number(value[0]);
            }, 0);
        }
        let readyForReturn = this.pushRelationship([Boolean(reduced)]);
        return {
            result: readyForReturn,
            errors: this.runtimeErrors.error
        };
    }
    generalLogicOfPriority(structure, validation) {
        let arrayOfResultAnt = [];
        validation.forEach(validationActual => {
            arrayOfResultAnt.push(validationActual.result(structure).result);
        });
        let resultado = new Result_1.default([{
                conditions: arrayOfResultAnt
            }]).result;
        let evalUte = new Evalueter_1.default(resultado).evaluete;
        return evalUte;
    }
}
exports.default = PriorityValidations;
