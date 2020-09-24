import validationPriority from "./validationPriority";

interface applyFuncValidation {

    relationship?: string,
    func: string,
    field: string,
    property?: Array<string>,
    res?: string,
    validation?: validationPriority

}

export default applyFuncValidation;