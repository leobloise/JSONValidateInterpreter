import StandardValidation from "./StandardValidation";

interface ArrayValidation extends StandardValidation {
    
    loops: number | string

}

export default ArrayValidation