// Second sample
var Class = function() {
    var klass = function() {
        this.init.apply(this, arguments);
    };

    klass.prototype.init = function() { };
    return klass;
};

var Person = new Class;

Person.prototype.init = function() {
    // Called on Person instantiation
};

Person.prototype.breath = function() {
    console.log('Saving!');
};

Person.find = function(id) {
    console.log("This is a 'class' function!" + id);
}

// Usage:
var person = new Person;
person.breath();
Person.find(1);