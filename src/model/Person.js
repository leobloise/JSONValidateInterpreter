class Person {

    constructor(name, age, cpf, address, job, study) {
        
        this.name = name
        this.age = age 
        this.cpf = cpf
        this.address = address
        this.job = job
        this.study = study

        this.methods = {
            cpfPlusAge: () => {
                return this.cpfPlusAge()
            }
        }


    }

    cpfPlusAge() {
        return this.cpf + String(this.age);
    }
}



exports.Person = Person;