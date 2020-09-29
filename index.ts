import JsonObjectFactory from './src/model/factory/JsonObjectFactory'
import fs from 'fs';
import path from 'path'
import ValidationsFactory from './src/factory/ValidationsFactory';

let json = String(fs.readFileSync(path.resolve(path.resolve(), 'custom', 'validacao.json')))

json = JSON.parse(json);

class Pessoa {

    public name: object
    public age: number
    public cpf: Array<string>

    constructor(name: object, age: number, cpf: Array<string>) {
        this.name = name
        this.age = age
        this.cpf = cpf;
    }

}

let resultados = ValidationsFactory.validations(new Pessoa({
    name: 'leonardo'
}, 20, [
    "1234567890",
    "1234567890"
]), json);

console.log(resultados);

// let resultado: any = interpreter.conditions;

// for(let result in resultado) {
//     console.log(resultado[result])
// }