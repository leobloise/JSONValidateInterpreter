const {JSONValidatorInterpreter} = require('../JSONValidatorInterpreter-test.js')
const {Person} = require('../model/Person.js')

class TestPersonValidation {

    constructor(person = '', jsonToValidate = undefined) {
        
        let personFromUser = {

            name: ((person['name'])?person['name']:'Leonardo Cardoso da Silva Bloise' ),
            age: person['age'] || 20,
            cpf: person['cpf'] || '182.080.157-84',
            address: person['address'] || 'St. Wall Street, 911',
            job: person['job']|| 'true',
            study: person['study'] || 'true'
        
        }

        this._personToValidate = new Person(personFromUser['name'], 
        personFromUser['age'], 
        personFromUser['cpf'], 
        personFromUser['address'], 
        personFromUser['job'], 
        personFromUser['study'])

        if(jsonToValidate === undefined) 
            throw new Error('You must especify any JSON to validate')
        
        this._json = jsonToValidate;

        return this._execute(this._personToValidate)
    }


    _execute(person) {

        return new JSONValidatorInterpreter(person, this._json).createAllConditions();
    
    }

}

exports.TestPersonValidation = TestPersonValidation