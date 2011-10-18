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
  created: function() { },
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
    return this.records[id] || console.log("Unknown record"); 
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
    this.parent.records[this.id] = this;
  },
  destroy: function() {
    delete this.parent.records[this.id]; 
  },
  update: function() {
    this.parent.records[this.id] = this; 
  },
  save: function(){
    this.newRecord ? this.create() : this.update();
  }
});

