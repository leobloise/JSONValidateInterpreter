class Evalueter {
    
    private filteredResult: Array<Array<boolean | string>>
    
    constructor(filteredResult:  Array<Array<boolean | string>>) {

        this.filteredResult = filteredResult;
    
    }

    get evaluete() {
        
        return this.filteredResult.map(result => {
            
            let stringToEvaluete = result.reduce((acumulator: string, value: boolean | string) => {
                
                acumulator += String(value);
                return acumulator; 
            
            }, '')

            return [Boolean(eval(stringToEvaluete))]
        })

    }
}

export default Evalueter;