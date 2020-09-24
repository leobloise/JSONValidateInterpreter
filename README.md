# TypeScript - JSONValidateInterpreter

Essa biblioteca está sendo reformulada para o typescript. Contudo, o seu intuito permanece o mesmo: realizar validações a partir de um JSON. 

## Como funciona

Para ela funcionar, você irá precisar de duas coisas: um objeto a ser validado e um JSON que irá realizar as validações desse objeto. Nesse caso, tanto um objeto literal quanto um objeto construído a partir das classes do ES6 irá funcionar. Contudo, minha recomendação é realizar a construção desse objeto de maneira literal, pois essa estrutura poderá ser mexida diversas vezes durante o percurso de validações.

Primeiro, você irá precisar ter esse JSON em mãos na forma de um objeto javascript. Por isso, você precisa obtê-lo de alguma forma e parseá-lo. Depois disso, basta passar os dois objetos para o interpretador que ele irá lidar com isso.

## Escrevendo as validações

As validações precisam ter um formato específico que será entendido pelo validador. Com isso, detalharei abaixo como fazê-lo. Entretanto, irei explicar como que passei esse formato de ifs e elses para a minha cabeça. Logo, já adianto que utilizei bastante de orientação a objeto e que é um pre - requesito para entendê-lo.

## O que são as validações?

As validações são, em essência, if's e else's que retornaram true ou false dependendo da situação. A partir disso, você pode fazer oque quiser com o resultado. 