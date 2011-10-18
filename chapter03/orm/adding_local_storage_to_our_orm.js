// Using jQuery from node js
var jQuery = require('jquery');
var localStorage = require('localStorage');

// Robert Kieffer pseudorandom GUIDs generator.
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
  // Let’s add an attributes array to the Model object, which individual models can use to specify their attributes
  created: function() { 
    this.records = {};
    this.attributes = [];
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
  },
  populate: function(values) {
  // Reset model & records this.records = {};
    for (var i = 0, il = values.length; i < il; i++) {
      var record = this.init(values[i]);
      record.newRecord = false;
      this.records[record.id] = record; 
    }
  }    
});

// Does not works
//Model.extend(LocalStorage);

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
  },
  // Let’s create an attributes() function, which will return an object of attributes to values
  attributes: function() {
    var result = {};
    for(var i in this.parent.attributes) {
      var attr = this.parent.attributes[i]; 
      result[attr] = this[attr];
    }
    result.id = this.id; 
    return result;
  },
  toJSON: function() {
    return (this.attributes());
  }
});

/*
  TODO Make this work it's not saving the records to HTML5 web storage (localStorage);
*/
Model.LocalStorage = {
  saveLocal: function(name) {
    // Turn records into an array
    var result = [];
    for (var i in this.records)
      result.push(this.records[i]);

    localStorage[name] = JSON.stringify(result); 
   },
  loadLocal: function(name) {
    var result = JSON.parse(localStorage[name]); 
    this.populate(result);
  }
};

Model.extend(Model.LocalStorage);