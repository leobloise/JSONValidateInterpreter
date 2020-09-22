class Validacoes {
    
    constructor(objectToBeValidated, jsonWithValidations) {
        this._object = objectToBeValidated;
        this._json = jsonWithValidations;
        return this._execute();
    }

    _execute() {
		
		let interpreter = new JSONValidatorInterpreter(this._object, this._json);
		let results = interpreter.createAllConditions()
		
		console.log('RESULTADO CRU SEM TRADUÇÃO ======================> ', results)
		
		let translator = new InterpreterTranslator(results);
		let translated = translator.getTranslatedResult();

		console.log('RESULTADO COM TRADUÇÃO ====================>', translated)

        return translated;
    }
}

export default Validacoes;