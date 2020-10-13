import resultFromValidator from "../interfaces/resultFromValidator";
import JsonObjectFactory from "../model/factory/JsonObjectFactory";
import ValidatorMachine from "../model/ValidatorMachine";

abstract class ValidationsFactory {

    public static validations(structure: any, json: any) {

        if(typeof json == 'string') { 
            json = JSON.parse(json);
        }

        let allJsonToOjbect = new JsonObjectFactory(json).jsonObjects;

        let allConditionsToObject = allJsonToOjbect.objectValidationsFromJson;

        let validatorMachine = new ValidatorMachine(structure, allConditionsToObject).result;

        let result: any = {}

        for(let validation in validatorMachine) {

            let insideValidation = validatorMachine[validation] as Array<resultFromValidator>;

            let allTogether = insideValidation.reduce((acumulator: resultFromValidator, validation) => {

                    return {
                        errors: acumulator.errors.concat(validation.errors),
                        result: acumulator.result.concat(validation.result)
                    }

                }, {
                    errors: [],
                    result: []
                }) 

                result[validation] = allTogether;
        
        }

        return result;

    }

}

export default ValidationsFactory;