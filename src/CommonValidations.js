class CommonValidations {

    constructor(fieldValue) {
        this._value = fieldValue;
    }

    isEmpty() {

        let valueTreatedToBeValidate = this._value;

        if(typeof valueTreatedToBeValidate != 'string') 
            valueTreatedToBeValidate = String(valueTreatedToBeValidate);

        valueTreatedToBeValidate = valueTreatedToBeValidate.replace(/\s/g, '');
        let lengthOfValue = valueTreatedToBeValidate.length;

        let empty = false;

        switch(valueTreatedToBeValidate) {
            case 'undefined':
                empty = true;
                break;
            case 'null':
                empty = true;
                break;
            case '':
                empty = true;
                break;
            default:
                break;
        }


        if(lengthOfValue == 0)
            empty = true;
        return empty;
	}

	isNotEmpty() {
		return !this.isEmpty();
	}
	
	isZero() {
		let valueTreatedToBeValidate = this._value;

		if(typeof valueTreatedToBeValidate != 'number') 
			valueTreatedToBeValidate = Number(valueTreatedToBeValidate)
		
		switch(valueTreatedToBeValidate) {
			case 0:
				return true;
			default: 
				return false;
		}
	}

	isNumeric() {

		let valueTreatedToBeValidate = this._value;
		if(typeof valueTreatedToBeValidate!= "string" )
			valueTreatedToBeValidate = String(valueTreatedToBeValidate);
		
		var num = /^[0-9]+$/;
		return (num.test(valueTreatedToBeValidate));
	
	}

	isNotNumeric() {
		return !(this.isNumeric());	
	}

    get originalValue() {
        return this._value;
    }

}

module.exports = {CommonValidations};