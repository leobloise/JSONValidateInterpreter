import resultFromValidator from "../../interfaces/resultFromValidator";
import ArrayValidation from "../../interfaces/validations/primary/arrayValidation";
import ValidationPriority from "../../interfaces/validations/secundary/validationPriority";
import ValidationStandard from "./ValidationStandard";

interface loops {
    i: number,
    n: number 
}

class ValidationArray extends ValidationStandard implements ArrayValidation {

    public loops: string | number;
    public once?: boolean;

    constructor(kind: string, loops: string | number, field: string, operator: string, target: string,
        property?: Array<string>, property_target?: Array<string>,
        type?: string, relationship?: string, validation?: ValidationPriority) {

        super(kind, field, operator, target, property, property_target, type, relationship, validation)
        this.loops = this.checkIfValidLoops(loops);
        Object.freeze(this);
    }

    public result(structure: any): resultFromValidator {

        let arrayFromjson = this.checkIfIsValidArray(structure, this)

        let target = this.filterTarget(structure, this);

        let loops: loops = this.filterLoops(arrayFromjson);
        
        let props: Array<string> | undefined = this.property;
        
        let result: number = 0;

        do {
            let field = arrayFromjson[loops.i]

            let fieldProper = this.applyProperlyProps(field, props)

            result += Number(this.getConditionResult(fieldProper, this.operator, target));

            loops.i ++;

        } while(loops.i < loops.n)

        let treatedResult: Array<boolean | string> = [Boolean(result)]

        treatedResult = this.pushRelationship(treatedResult);

        return {
            result: treatedResult,
            errors: this.runtimeErrors.error
        } as resultFromValidator;
    
    }

    public checkIfIsValidArray(structure: any,validation: ValidationArray): Array<any> {
             
        if(!validation.field) {
            this.pushError('Array was not given. So, empty array returned')
            return [];
        }

        if(typeof structure[validation.field] !== "object") {
            this.pushError('Not valid array from object. So, empty array returned')
            return [];
        }
       
        return structure[validation.field]

    }

    private checkIfValidLoops(loops: string | number): string {

        if(typeof loops === 'number') {

            if(!isNaN(loops)) {

                return this.loopsBiggerZero(String(loops));
     
            }
            
        } else {

            if(loops === 'all')
            return loops;

            if(loops.includes('num:')) {
            
                this.once = true;
                return this.loopsBiggerZero(String(Number(loops.split('num:')[1].trim()) - 1));
    
            }
        }

        return '';

    }

    private loopsBiggerZero(loops: string) {
        
        if(Number(loops) < 0) {
            this.pushError(`Loops ${loops} invalid. Empty string given`)
            return '';
        }

        return loops;

    }

    private filterLoops(arrayFromjson: Array<any>): loops {

        let all = arrayFromjson.length;

        if(this.loops === '') {

            this.pushError('There was an error with loops. So all array length returned.')
            return {
                i: 0,
                n: all
            };

        }

        if(this.loops == 'all')
            return {
                i: 0,
                n: all
            };
        
        if(this.once) {

            return {
                i: Number(this.loops),
                n: Number(this.loops) + 1
            };
        }

        if(!isNaN(Number(this.loops))) {
            return {
                i: 0,
                n: Number(this.loops)
            }
        }

        this.pushError('Invalid value recieved. So, all array quantity returned')

        return {
            i: 0,
            n: all
        };

    }

}

export default ValidationArray;