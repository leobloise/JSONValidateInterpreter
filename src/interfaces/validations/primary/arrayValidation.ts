import validationPriority from "../secundary/validationPriority";

interface arrayValidation {
    
    loops: number | string,
    field: string,
    operator: string,
    target: string,
    property_item?: Array<string>,
    property_target?: Array<string>,
    type?: string,
    validation?: validationPriority,
    relationship?: string

}

export default arrayValidation