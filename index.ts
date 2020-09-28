import JSONInterpreter from "./src/model/JSONInterpreter"
import JsonObjectFactory from './src/model/factory/JsonObjectFactory'
import fs from 'fs';
import path from 'path'
import ValidationsObject from "./src/model/ValidationsObject";
import ValidatorMachine from "./src/model/ValidatorMachine";

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

let allJsonToObject = new JsonObjectFactory(json).jsonObjects;

let allConditionsToObject = allJsonToObject.objectValidationsFromJson;

let validatorMachine = new ValidatorMachine(new Pessoa({
    name: 'Leonardo'
}, 20,
['123456789', '12345678']), allConditionsToObject)

// let resultado: any = interpreter.conditions;

// for(let result in resultado) {
//     console.log(resultado[result])
// }