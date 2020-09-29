import fs from 'fs';
import path from 'path'

import getValidations from '../index';

let json = String(fs.readFileSync(path.resolve(path.resolve(), 'custom', 'validacao.json')))

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


let pessoaTeste = new Pessoa({
    name: 'leonardo'
}, 20, [
    "1234567890",
    "1234567890"
]);

console.log(getValidations(json, pessoaTeste))
    