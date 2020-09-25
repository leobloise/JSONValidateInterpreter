import validationPriority from '../secundary/validationPriority'

interface commonValidation {
    
    relationship?: string,
    field: string,
    property?: Array<string>,
    operator: string,
    type?: string,
    target: string,
    property_target?: Array<string>
    validation?: validationPriority

}

export default commonValidation