import validationPriority from './validationPriority'

interface commonValidation {
    
    relationship?: string,
    field: string,
    property?: Array<string>,
    operator: string,
    type?: string,
    target: string,
    res?: string,
    property_target?: Array<string>
    validation?: validationPriority

}

export default commonValidation