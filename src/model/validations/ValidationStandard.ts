import resultFromValidator from "../../interfaces/resultFromValidator";
import StandardValidation from "../../interfaces/validations/primary/StandardValidation";
import ValidationPriority from "../../interfaces/validations/secundary/validationPriority";
import Validation from "./Validation";

class ValidationStandard extends Validation implements StandardValidation {

    public operator: string;
    public property_target?: Array<string>;
    public type?: string
    public target: string
    
    constructor(kind: string, field: string, operator: string, target: string,
        property?: Array<string>, property_target?: Array<string>,
        type?: string, relationship?: string, validation?: ValidationPriority) {

            super(kind, field, property, relationship, validation)
            this.operator = operator;
            this.property_target = property_target;
            this.target = target;
            this.type = this.checkType(type);

    }

    
    private checkType(type?: string): string | undefined {
        
        if(typeof type === 'undefined') {
            return type;
        }

        let allowedTypes = [
            'Number',
            'Boolean',
            'String'
        ]

        if(!allowedTypes.includes(type)) {
            this.pushError(`This ${type} does not exist or not coded. So, String will be used`);
            return 'String';
        }

        return type;
    }

    public result(structure: any): resultFromValidator {

        let field = this.filterField(structure, this);
        
        let target = this.filterTarget(structure, this);

        let result = this.getConditionResult(field, this.operator, target);
    
        return {
            result: this.pushRelationship([result]),
            errors: this.runtimeErrors.error
        } as resultFromValidator;

    }

}

export default ValidationStandard;