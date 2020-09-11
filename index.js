const {TestPersonValidation} = require('./src/test/TestPersonValidation.js')
const jsonToValidate = require('./json/personValidation.json')
const {InterpreterTranslator} = require('./src/InterpreterTranslator.js')

let conditions = new TestPersonValidation("", jsonToValidate)

let teste = new InterpreterTranslator(conditions).getTranslatedResult();

console.log(conditions)
console.log(teste)


