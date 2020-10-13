"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const index_1 = __importDefault(require("../index"));
let json = String(fs_1.default.readFileSync(path_1.default.resolve(path_1.default.resolve(), 'custom', 'validacao.json')));
class Pessoa {
    constructor(name, age, cpf) {
        this.name = name;
        this.age = age;
        this.cpf = cpf;
    }
}
let pessoaTeste = new Pessoa({
    name: 'leonardo'
}, 20, [
    "1234567890",
    "1234567890"
]);
console.log(index_1.default(json, pessoaTeste));
