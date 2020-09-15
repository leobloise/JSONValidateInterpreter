# JSONValidateInterpreter

Biblioteca auxiliar feita em javascript que pode receber um JSON com uma determinada estrutura e criar estruturas de validações automaticamente. 


<h2> Testando </h2>

Para testar, abra o cmd e navegue ao diretorio da pasta. Depois disso, digite: npm test. 


<h1> Como funciona </h1>

Basicamente, esse interpretador precisa receber um objeto contendo os campos que serão validados e um respectivo JSON especificando as validações desses campos.

Além disso, todos os valores dos campos precisam ser preenchidos e não podem ser objetos ou arrays ANTES do momento da validação.

A estrutura básica de uma validação será exemplificada mais tarde, porém, por agora, veja como começar a escrever suas condições.

<pre>
     "objetoParaSerValidado": {
        "validations": [
            {
                "field": "nomeDoCampo",
                "operator": "operador",
                "target": "valor"
            }
        ]
    }
</pre>

Field -> Indica a propriedade do objeto para ser validado que você quer validar.<br><br>
Operator -> Qual operação de validação você quer realizar?<br><br>
Target -> Qual o valor que você deseja comparar esse campo.

<h2> Resultado </h2>

Como resultado, você poderá receber diferentes outputs dependendo das validações que você fez. Contudo, cada array de validações - validations - irá gerar um resultado final. Esse resultado será um array de arrays, onde cada array interior contêm o resultado da operação.

<pre>
    [
        [resultadoDaPrimeiraValidacao],
        [resultadoDaSegundaValidacao]
    ]
</pre>

<h1> Exemplo com o objeto Person </h1>

Para ajudar com o entendimento, iremos utilizar um objeto a ser validado com essa estrutura: 

<pre>
class Person {

    constructor(name, age, cpf, address, job, study) 
    {
        
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
</pre>

Com isso, iremos começar com uma validação básica: 

<pre>
"personValidation_sample1": {
        "validations": [
            {
                "field": "name",
                "operator": "equal",
                "target": "Leonardo Cardoso da Silva Bloise"
            }
        ]
    },
</pre>

Essa validação está comparando o nome do objeto person com o valor de target. Caso seja verdadeiro, ela retornará true e, caso seja false, ela retornará true.

Contudo, muitas vezes, você deseja acessar o tamanho dessa string com a propriedade .length, por exemplo. Por isso, você pode acessar propriedades de campos determinados no "field" através da seguinte maneira:

<pre>
 "personValidation_sample2_property": {
        "validations": [
            {
                "field": "name",
                "property": "length",
                "operator": "bigger",
                "target": "10"
            }
        ]
    },
</pre>

Nessa validação, está comparando-se o tamanho do campo name com o valor dez. Caso ele seja maior que dez, retornará true, caso não, retornará false.

<h2> Encadeando condições </h2>

Todos os exemplos anteriores podem ser traduzidos para isso:

<pre>
    if(name.length > 10) {
        ...
    }
    if(name == 'Leonardo Cardoso da Silva Bloise'){
        ...
    }
</pre>

Contudo, muitas vezes gostariamos de fazer o seguinte:

<pre>
    if(name.length > 10 || name == 'Leo') {
        ...
    }
</pre>

Logo, para entendermos isso, o JSON irá entender isso como um relacionamento. Nesse caso, teriamos um relacionamento do tipo OU, mas podemos ter um relacionamento do tipo E. Logo, para explicitarmos isso, faremos o seguinte:

<pre>
"personValidation_name_relationship_*":
    {
        "validations":[
            {
                "relationship": "or",
                "field": "name",
                "property": "length",
                "operator": "bigger",  
                "target": "10"
            },
            {
                "field": "name",
                "operator": "equal",
                "target": "Leo"
            }
        ]
    },
</pre>

Esse JSON acima irá retornar algo parecido com isso como resultado: 

<pre>
    [
        [true, '+', true]
    ]
</pre>

O '+' é o representante matemática do relacionamento OU e, como nenhum dos dois tem uma ordem de prescedência maior do que o outro, o resultado cru é dessa forma.

Caso fosse um relacinamento do tipo and, o resultado seria:

<pre>
    [
        [true, '*', true]
    ]
</pre>

Esse é o representante do relacionamento do tipo AND. 

Uma outra forma mais prática de realizar essa mesma condição é dessa forma abaixo:

<pre>
"personValidation_age_usingand_true": {
        "validations": [
            {
                "operator": "or",
                "condition1": {
                    "field": "name",
                    "property": "length",
                    "operator": "bigger",  
                    "target": "10"
                },
                "condition2":{
                    "field": "name",
                    "operator": "equal",
                    "target": "Léo"
                }
            }
        ]
    }
</pre>

Esse bloco de condição acima resume a primeira forma, te permite encadear infinitas condições de maneira prática e, também, te retorna somente um resultado:

<pre>
    [
        [true]
    ]
</pre>

Entretanto, uma limitação desse modo é que você não pode controlar o tipo de relacionamento entre cada uma das condições.

