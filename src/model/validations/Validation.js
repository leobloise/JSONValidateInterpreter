"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Condition_1 = __importDefault(require("./Condition"));
class Validation extends Condition_1.default {
    constructor(kind, field, property, relationship, validation) {
        super(kind, relationship, validation);
        this.field = field;
        this.property = property;
    }
}
exports.default = Validation;
