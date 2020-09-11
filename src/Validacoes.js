class Validacoes {
    
    constructor(objectToBeValidated, jsonWithValidations) {
        this._object = objectToBeValidated;
        this._json = jsonWithValidations;
        return this._execute();
    }

    _execute() {
        let interpreter = new JSONValidatorInterpreter(this._object, this._json);
        let translator = new InterpreterTranslator(interpreter.createAllConditions());

        return translator.getTranslatedResult();
    }
}