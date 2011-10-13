//adding scope control to our class facility
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

  // Adding a proxy function
  klass.proxy = function(func) {
    var self = this;
    return(function() { return func.apply(self, arguments); });
  }

  // Add the function on instances too 
  klass.fn.proxy = klass.proxy;

  return klass; 
};

//var Button = new Class;
//Button.include({
  //init: function(element) { this.element = jQuery(element);
  // Proxy the click function
  //this.element.click(this.proxy(this.click)); },
  //click: function() { /* ... */ } 
//});