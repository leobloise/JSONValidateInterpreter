"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Evalueter {
    constructor(filteredResult) {
        this.filteredResult = filteredResult;
    }
    get evaluete() {
        return this.filteredResult.map(result => {
            let stringToEvaluete = result.reduce((acumulator, value) => {
                acumulator += String(value);
                return acumulator;
            }, '');
            return [Boolean(eval(stringToEvaluete))];
        });
    }
}
exports.default = Evalueter;
