"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Result_1 = __importDefault(require("../../helper/Result"));
class Condition {
    constructor(kind, relationship, validation) {
        this.runtimeErrors = {
            error: []
        };
        this.resultFunc = (result) => {
            let realResult = new Result_1.default(result).result;
            return realResult;
        };
        this.validation = validation;
        this.relationship = this.checkRelationship(relationship);
        this.kind = kind;
    }
    /**
     * @method checkRelationship
     * @param response
     * @param validation
     * @summary This method will check if there are any relationship between two validations. If it's true, then
     * the math operation equivalent to this relationship will be added to response.
     */
    checkRelationship(relationship) {
        if (typeof relationship !== 'undefined')
            return (this.getRelationship(relationship));
        return undefined;
    }
    pushRelationship(result) {
        if (this.relationship)
            result.push(this.relationship);
        return result;
    }
    /**
     * @method getRelationship
     * @param {strng} relationship
     * @summary This method will translate the relationship given.
     */
    getRelationship(relationship) {
        switch (relationship) {
            case "and":
                return '*';
            case "or":
                return '+';
            default:
                this.pushError(`This ${relationship} does not exist. So, relationship or will be used`);
                return '+';
        }
    }
    result(structure) {
        console.log('VOCÊ DEVE ME ALTERAR!');
        return {
            errors: [''],
            result: ['']
        };
    }
    filterField(structure, validation) {
        if (typeof validation.field !== "string") {
            this.pushError(`Field in ${validation} is not valid or does not exist in ${validation}. So, empty string will be given as result`);
            return '';
        }
        if (typeof structure[validation.field] == "undefined") {
            this.pushError(`Field in ${validation} is not valid or does not exist in ${validation}. So, empty string will be given as result`);
            return '';
        }
        return this.applyProperlyProps(structure[validation.field], validation.property);
    }
    applyProperlyProps(field, prop) {
        if (!prop)
            return this.getField(field);
        prop.forEach(eachProp => {
            if (typeof field[eachProp] == "undefined") {
                this.pushError(`Property ${eachProp} does not exist in ${field}. So, empty string will be given as result`);
                return '';
            }
            field = this.getField(field[eachProp]);
            return;
        });
        return field;
    }
    getField(field) {
        if (typeof field !== 'function')
            return field;
        return field();
    }
    filterTarget(structure, validation) {
        if (typeof validation.target !== "string") {
            this.pushError(`Target ${validation.target} is not valid or does not exist. So, empty string will be given as result`);
            return '';
        }
        let target = this.checkIfPropOrNot(validation.target);
        if (!validation.type && validation.operator.includes('strict')) {
            this.pushError(`Strict comparison must be done using types`);
            return '';
        }
        if (validation.type)
            target = this.transformTo(target, validation.type);
        if (validation.property_target) {
            target = this.applyProperlyProps(target, validation.property_target);
            0;
        }
        return target;
    }
    checkIfPropOrNot(target) {
        if (!target.includes('prop:'))
            return target;
        let prop = target.split('prop:')[1].trim();
        return this.applyProperlyProps(target, [prop]);
    }
    transformTo(srt, type) {
        switch (type) {
            case 'Number':
                return Number(srt);
            case 'Boolean':
                if (srt === 'false') {
                    return false;
                }
                return Boolean(srt);
            default:
                return String(srt);
        }
    }
    getConditionResult(field, operator, target) {
        switch (operator) {
            case 'bigger':
                return field > target;
            case 'smaller':
                return field < target;
            case 'equal':
                return field == target;
            case 'diff':
                return field != target;
            case 'biggerequal':
                return field >= target;
            case 'smallerequal':
                return field <= target;
            case 'strictequal':
                return field === target;
            case 'strictdiff':
                return field !== target;
            default:
                this.pushError(`This ${operator} does not exist or not coded: read the documentation. So, false will be returned`);
                return false;
        }
    }
    pushError(error) {
        return this.runtimeErrors.error.push(error);
    }
}
exports.default = Condition;
