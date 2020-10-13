"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Validation_1 = __importDefault(require("./Validation"));
class ValidationStandard extends Validation_1.default {
    constructor(kind, field, operator, target, property, property_target, type, relationship, validation) {
        super(kind, field, property, relationship, validation);
        this.operator = operator;
        this.property_target = property_target;
        this.target = target;
        this.type = this.checkType(type);
    }
    checkType(type) {
        if (typeof type === 'undefined') {
            return type;
        }
        let allowedTypes = [
            'Number',
            'Boolean',
            'String'
        ];
        if (!allowedTypes.includes(type)) {
            this.pushError(`This ${type} does not exist or not coded. So, String will be used`);
            return 'String';
        }
        return type;
    }
    result(structure) {
        let field = this.filterField(structure, this);
        let target = this.filterTarget(structure, this);
        let result = this.getConditionResult(field, this.operator, target);
        return {
            result: this.pushRelationship([result]),
            errors: this.runtimeErrors.error
        };
    }
}
exports.default = ValidationStandard;
