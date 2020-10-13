import ValidationsFactory from './src/factory/ValidationsFactory';

export default function getValidations(json: string, struct: object) {
    
    let objectJson = JSON.parse(json);

    let result = ValidationsFactory.validations(struct, objectJson)

    return result;

}

