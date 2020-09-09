const testejson = require("./json/teste2.json")

const {JSONValidatorInterpreter} = require('./model/JSONValidatorInterpreter.js')

class Teste {
    constructor(name, idade, cidade) {
        this.name = name
        this.idade = idade
        this.cidade = cidade
    }
}

let teste = new Teste(`Leonardo Cardoso da Silva Bloise`,
15, `Rio de Janeiro`)

const conditions = new JSONValidatorInterpreter(teste, testejson).createAllConditions();

console.log(conditions)