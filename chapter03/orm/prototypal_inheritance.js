
var Model = {
  inherited: function() { }, 
  created: function() { },
  prototype: {
    init: function() { }
  },
  create: function() {
    var object = Object.create(this);
    object.parent = this;
    object.prototype = object.fn = Object.create(this.prototype);
    object.created();
    this.inherited(object);
    return object;
  },
  init: function() {
    var instance = Object.create(this.prototype); 
    instance.parent = this; 
    instance.init.apply(instance, arguments); 
    return instance;
  } 
};

// Putting something in the 'create' hooks
Model.created = function() {
  console.log("Model created!");
}

// Here is how we use it
// Create the User model
var User = Model.create();
// Create an instance using User.prototype
var user = User.init();


