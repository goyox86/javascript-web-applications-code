
// In JavaScript, you can namespace functions and variables by making them properties of an object.
// In this case we are using the User object as the namespace for all user related data logic management
var User = {
  records: [],
  fetchRemote: function() { console.log("fetchRemote called!"); }
};

// We can go even further and namespace 'instance' level functions like 'destroy' by adding it to the User object prototype.
// Here we first make the User to behave just like a sort of class
// This actually does nothing just allows us to call new User in order to create new instances
var User = function(atts) { 
 this.attributes = atts || {};
};

// Adding 'class' level properties
User.records = [];
User.fetchRemote = function() { console.log("fetchRemote called!"); }

// Adding 'class' level properties to the User prototype in order to make them callable from the User instances
User.prototype.destroy = function() { console.log("destroy called!"); };

// Accessing 'class' level properties
User.records;
User.fetchRemote();

// Creating an 'instance' of User and calling a 'instance' property onto it
user = new User;
user.destroy();
