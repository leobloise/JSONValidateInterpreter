import JSONInterpreter from "./src/model/JSONInterpreter"
import JsonObjectFactory from './src/model/factory/JsonObjectFactory'
import fs from 'fs';
import path from 'path'

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

console.log(new JsonObjectFactory(json).teste)  

// let interpreter = new JSONInterpreter(new Pessoa({
//     name: 'Leonardo'
// }, 20,
// ['123456789', '12345678']), json)

// let resultado: any = interpreter.conditions;

// for(let result in resultado) {
//     console.log(resultado[result])
// }