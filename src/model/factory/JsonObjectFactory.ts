import JsonObject from "../ObjectJson";

interface resultFromFactory {
    [index: string]: JsonObject
}

class JsonObjectFactory {

    private json: any;
    
    constructor(json: any) {

        this.json = json;

    }

    get jsonObjects() {
        
        let arrayOfObjectValidations: resultFromFactory = {};

        for(let i in this.json) {
           
            arrayOfObjectValidations[i] = this.json[i]

        }

        return new JsonObject(arrayOfObjectValidations);

    }
}

export default JsonObjectFactory;