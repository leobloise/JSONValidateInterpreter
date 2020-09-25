import validationPriority from "../secundary/validationPriority";

interface applyFuncValidation {

    relationship?: string,
    func: string,
    field: string,
    property?: Array<string>,
    validation?: validationPriority

}

export default applyFuncValidation;