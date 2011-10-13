var Class = function() { 
  var klass = function() {
    this.init.apply(this, arguments); 
  };

  klass.prototype.init = function() { };
  // Shortcut to access prototype 
  klass.fn = klass.prototype;
  // Shortcut to access class 
  klass.fn.parent = klass;
  
  // Adding class properties 
  klass.extend = function(obj) {
    var extended = obj.extended; 
    for(var i in obj) {
      klass[i] = obj[i]; 
    }
    // support for the 'extended' hook
    if (extended) extended(klass) 
  };
  
  // Adding instance properties
  klass.include = function(obj) {
    var included = obj.included; 
    for(var i in obj) {
      klass.fn[i] = obj[i]; 
    }
    // support for the 'included' hook
    if (included) included(klass) 
  };

  return klass; 
};

//with the changes made (include/extend) now we have implemented a Ruby mixin like facility
var ORMModule = {
  save: function(){ 
    console.log('Saving!');
  }
};

var Person = new Class;
// adding it as 'instance properties'
Person.include(ORMModule);
// adding it as 'class properties'
Person.extend(ORMModule);

var person = new Person;
person.save();
Person.save();