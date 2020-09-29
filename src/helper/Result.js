"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Result {
    constructor(conditions) {
        this.conditions = conditions;
    }
    get result() {
        let filteredResult = this.conditions.map(res => res.conditions.reduce((acumulator, condtion) => acumulator.concat(condtion), []));
        return filteredResult;
    }
}
exports.default = Result;
