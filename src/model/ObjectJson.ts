import ObjectJson from "../interfaces/ObjectJson";
import ObjectValidations from "../interfaces/ObjectValidations";
import resultFromJsonObject from "../interfaces/resultFromJsonObject";
import ComplexCondition from "./validations/ComplexCondition";
import Condition from "./validations/Condition";
import ValidationsObject from "./ValidationsObject";


class JsonObject implements ObjectJson {

    public objectValidations: Array<ObjectValidations>;

    constructor(json: any) {

        this.objectValidations= json;

    }

    get objectValidationsFromJson() {

        let resultado: resultFromJsonObject = {};

        for(let validation in this.objectValidations) {

            resultado[validation] = new ValidationsObject(this.objectValidations[validation].validations as Array< Condition | ComplexCondition>);
        
        }

        return resultado;

    }

}

export default JsonObject;