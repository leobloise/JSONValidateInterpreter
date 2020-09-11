class InterpreterTranslator {
    
    constructor(resultFromInterpreter) {

        this._result = this._validResult(resultFromInterpreter);
    
    }

    _validResult(conditions) {
        
        if(typeof conditions !== 'object')
            throw new Error('I just translate arrays')

        conditions.forEach(condition => {
            
            if(typeof condition !== 'object') 
                throw new Error('This array is not valid')
            
            condition.forEach(specificCondtion => {
                
                if(typeof specificCondtion === 'string') {
                    
                    if(specificCondtion === '*' || specificCondtion === '+' || specificCondtion.includes('res:')) 
                        return;
                    else
                        throw new Error('Invalid array')
                }

                if(typeof specificCondtion === 'boolean')
                    return;
                else 
                    throw new Error('Invalid array')
                
            })
        })
        
        console.log('All right!')
        return conditions;
    }

    getTranslatedResult() {
        
        let resultTranslated = []

        this._result.forEach(result => {
            
            let conditionObject = {
                condition: '',
                res: ''
            }

            let stringToBeEvaluetedSecuritly = ''

            result.forEach(resultOfConditions => {
                
                if(typeof resultOfConditions === 'string' && resultOfConditions.includes('res:')) {
                    conditionObject.res = resultOfConditions.split('res:')[1].trim()
                    return;
                }
                
                stringToBeEvaluetedSecuritly += resultOfConditions + ' '

                return; 
            })

            conditionObject.condition = Boolean(eval(stringToBeEvaluetedSecuritly))
            
            resultTranslated.push(conditionObject)
        })
                   
        return resultTranslated;

    }

}

exports.InterpreterTranslator = InterpreterTranslator