// the prototype property can be used to implement inheritance
var Animal = function() { };
Animal.prototype.breath = function() { console.log('breath'); };
var Dog = function() { };
// Dog inherits from Animal 
Dog.prototype = new Animal;
Dog.prototype.wag = function() { console.log('wag tail'); };

var maximo = new Dog;
maximo.breath();
maximo.wag();