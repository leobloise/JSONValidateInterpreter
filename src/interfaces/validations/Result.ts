import validationResult from "./validationResult";

interface resultFromValidatorMachine {
    [index: string]: validationResult;
};

export default resultFromValidatorMachine;