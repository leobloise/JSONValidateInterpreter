import validationPriority from './validationPriority'

interface setValidation {

    set: string,
    expected?: string,
    value: string,
    validationsNeed?: validationPriority

}


export default setValidation;