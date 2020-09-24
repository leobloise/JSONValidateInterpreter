import JSONInterpreter from "./src/model/JSONInterpreter"

import fs from 'fs';
import path from 'path'

let json = String(fs.readFileSync(path.resolve(path.resolve(), 'custom', 'validacao.json')))

json = JSON.parse(json);

class Pessoa {

    public name: object
    public age: number

    constructor(name: object, age: number) {
        this.name = name
        this.age = age
    }

}

let interpreter = new JSONInterpreter(new Pessoa({
    name: 'Leonardo'
}, 20), json)

let resultado: any = interpreter.conditions;

for(let result in resultado) {
    console.log(resultado[result])
}