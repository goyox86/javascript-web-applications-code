// Third sample: inclusion of the extend and include methods for a cleaner syntax when adding 'class' menthods and 'include' methods
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

var Person = new Class;

//Using extend
Person.extend({
  find: function(id) { /* ... */ }, 
  exists: function(id) { /* ... */ },
  // using the extended hook
  extended: function(klass) {
    //console.log(klass, " was extended!"); 
  }
});

Person.find(1);

//Using include
Person.include({
  save: function(id) { /* ... */ },
  destroy: function(id) { /* ... */ } 
});

var person = new Person; 
person.save();