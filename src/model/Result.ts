interface response {
    conditions: Array<Array<boolean | string>>
}

class Result implements response {

    public conditions: Array<any>

    constructor(conditions: Array<any>) {
        
        this.conditions = conditions;

    }

    get result() {

        let filteredResult: Array<Array<boolean | string>> = this.conditions.map(res => res.conditions.reduce((acumulator: Array<boolean>, condtion: any) => acumulator.concat(condtion), []))

        return filteredResult;

    }

}

export default Result;