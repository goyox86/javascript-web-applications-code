//adding inheritance facility to our Class library
var Class = function(parent) { 
  var klass = function() {
    this.init.apply(this, arguments); 
  };
  // Change klass' prototype
  if (parent) {
    var subclass = function() { };
    subclass.prototype = parent.prototype;
    klass.prototype = new subclass; 
  };
  klass.prototype.init = function(){ };
  // Shortcuts
  klass.fn = klass.prototype; 
  klass.fn.parent = klass; 
  klass._super = klass.__proto__;

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

var Animal = new Class;
Animal.include({ 
  breath: function(){ console.log('breath'); }
});

// creating a Cat class which inheriths from Animal (caveat: only instance properties not class properties are copied)
var Cat = new Class(Animal);

// Usage
var tommy = new Cat; 
tommy.breath();