import JSONInterpreter from "./src/model/JSONInterpreter"

import fs from 'fs';
import path from 'path'

let json = String(fs.readFileSync(path.resolve(path.resolve(), 'custom', 'validacao.json')))

json = JSON.parse(json);

class Pessoa {

    public name: string
    public age: number

    constructor(name: string, age: number) {
        this.name = name
        this.age = age
    }

}

let interpreter = new JSONInterpreter(new Pessoa('Leonardo', 20), json)

console.log(interpreter.teste());