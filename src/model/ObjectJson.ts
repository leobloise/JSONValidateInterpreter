import ObjectJson from "../interfaces/ObjectJson";
import ObjectValidations from "../interfaces/ObjectValidations";

class JsonObject implements ObjectJson {

    public objectValidation: Array<ObjectValidations>;

    constructor(json: any) {

        this.objectValidation = json;

    }


}