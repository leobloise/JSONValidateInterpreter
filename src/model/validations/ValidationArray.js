"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ValidationStandard_1 = __importDefault(require("./ValidationStandard"));
class ValidationArray extends ValidationStandard_1.default {
    constructor(kind, loops, field, operator, target, property, property_target, type, relationship, validation) {
        super(kind, field, operator, target, property, property_target, type, relationship, validation);
        this.loops = this.checkIfValidLoops(loops);
        Object.freeze(this);
    }
    result(structure) {
        let arrayFromjson = this.checkIfIsValidArray(structure, this);
        let target = this.filterTarget(structure, this);
        let loops = this.filterLoops(arrayFromjson);
        let props = this.property;
        let result = 0;
        do {
            let field = arrayFromjson[loops.i];
            let fieldProper = this.applyProperlyProps(field, props);
            result += Number(this.getConditionResult(fieldProper, this.operator, target));
            loops.i++;
        } while (loops.i < loops.n);
        let treatedResult = [Boolean(result)];
        treatedResult = this.pushRelationship(treatedResult);
        return {
            result: treatedResult,
            errors: this.runtimeErrors.error
        };
    }
    checkIfIsValidArray(structure, validation) {
        if (!validation.field) {
            this.pushError('Array was not given. So, empty array returned');
            return [];
        }
        if (typeof structure[validation.field] !== "object") {
            this.pushError('Not valid array from object. So, empty array returned');
            return [];
        }
        return structure[validation.field];
    }
    checkIfValidLoops(loops) {
        if (typeof loops === 'number') {
            if (!isNaN(loops)) {
                return this.loopsBiggerZero(String(loops));
            }
        }
        else {
            if (loops === 'all')
                return loops;
            if (loops.includes('num:')) {
                this.once = true;
                return this.loopsBiggerZero(String(Number(loops.split('num:')[1].trim()) - 1));
            }
        }
        return '';
    }
    loopsBiggerZero(loops) {
        if (Number(loops) < 0) {
            this.pushError(`Loops ${loops} invalid. Empty string given`);
            return '';
        }
        return loops;
    }
    filterLoops(arrayFromjson) {
        let all = arrayFromjson.length;
        if (this.loops === '') {
            this.pushError('There was an error with loops. So all array length returned.');
            return {
                i: 0,
                n: all
            };
        }
        if (this.loops == 'all')
            return {
                i: 0,
                n: all
            };
        if (this.once) {
            return {
                i: Number(this.loops),
                n: Number(this.loops) + 1
            };
        }
        if (!isNaN(Number(this.loops))) {
            return {
                i: 0,
                n: Number(this.loops)
            };
        }
        this.pushError('Invalid value recieved. So, all array quantity returned');
        return {
            i: 0,
            n: all
        };
    }
}
exports.default = ValidationArray;
