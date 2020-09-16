class Validacoes {
    
    constructor(objectToBeValidated, jsonWithValidations) {
        this._object = objectToBeValidated;
        this._json = jsonWithValidations;
        return this._execute();
    }

    _execute() {
		
		let interpreter = new JSONValidatorInterpreter(this._object, this._json);
		let results = interpreter.createAllConditions()
		
		let translator = new InterpreterTranslator(results);

        return translator.getTranslatedResult();
    }
}