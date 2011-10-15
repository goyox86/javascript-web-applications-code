// Using jQuery from node js
var jQuery = require('jquery');

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

// Add object properties
jQuery.extend(Model, {
  find: function() { console.log("find called!"); } 
});
// Add instance properties 
jQuery.extend(Model.prototype, {
  init: function(atts) {
    if (atts) this.load(atts);
  },
  load: function(attributes) {
    for(var name in attributes) 
      this[name] = attributes[name];
  } 
});

// Creating a User model
User = Model.create();
// Creating a User instance and initializing it with some attributes
user = User.init({ name : "Jose",
                   last_name : "Narvaez" });

// Checking for the values of attributes
console.log(user.name);
console.log(user.last_name);

