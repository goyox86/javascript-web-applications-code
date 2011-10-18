// If you’ve been observing closely, you might have spotted a bug relating to the references in our ORM. We’re not cloning instances when they’re returned by find() 
// or when we’re saving them, so if we change any properties, they’re changed on the original asset. This is a problem because we only want assets to update when we 
// call the update() function.

// Using jQuery from node js
var jQuery = require('jquery');

//Robert Kieffer pseudorandom GUIDs generator.
Math.guid = function() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
    return v.toString(16); 
  }).toUpperCase();
};

var Model = {
  // The 'records' object Model property
  records: {},
  inherited: function() { }, 
  // With the previous implementation we had problem 'Model.records' is an object shared by every model. This has the unfortunate side effect of mixing up all the records.
  // In order to fix it we are using the 'created' hook to create a scoped 'records' property belonging to 'this' which in this case is Model.  
  created: function() { 
    this.records = { };
  },
  extended: function() { },
  included: function() { },

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
  },
  extend: function(o) {
    var extended = o.extended;
    jQuery.extend(this,o);
    if (extended) extended(this);
  },
  include: function(o) {
    var included = o.included;
    jQuery.extend(this.prototype,o);
    if (included) included(this);
  }
};

// Doing the same in the previous example but now using the Model#extend and Model#include 'class' level function
Model.extend({
  // Find by ID, or raise an exception 
  find: function(id) {
    var record = this.records[id];
    if ( !record ) console.log("Unknown record");
    return record.dup(); 
  }
});

// Add instance properties 
Model.include({
  init: function(atts) {
    if (atts) this.load(atts);
  },
  load: function(attributes) {
    for(var name in attributes) 
      this[name] = attributes[name];
  },
  newRecord: true,
  create: function() {
    if ( !this.id ) this.id = Math.guid(); 
    this.newRecord = false; 
    this.parent.records[this.id] = this.dup();
  },
  destroy: function() {
    delete this.parent.records[this.id]; 
  },
  update: function() {
    this.parent.records[this.id] = this.dup(); 
  },
  save: function(){
    this.newRecord ? this.create() : this.update();
  },
  // From jQuery API docs: 
  // jQuery.extend( [deep], target, object1 [, objectN] )
  // deepIf true, the merge becomes recursive (aka. deep copy).
  // target The object to extend. It will receive the new properties.
  // object1 An object containing additional properties to merge in.
  // objectN Additional objects containing properties to merge in.
  // In conclusion this dup implementation uses jQuery extend telling it make a deep copy extending an empty object with 'this'
  dup: function(){
    return jQuery.extend(true, {}, this);
  }
});

