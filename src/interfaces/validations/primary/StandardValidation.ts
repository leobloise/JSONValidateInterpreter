import Validation from '../Validation'

interface StandardValidation extends Validation {
    
    operator: string,
    type?: string,
    target: string,
    property_target?: Array<string>

}

export default StandardValidation;