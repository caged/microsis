function Person(){
}

Person.prototype.setName = function(name) {
	/** the Person's name */
    this.name = name;
	
	/** get the Person's name */
    this.getName = function(){return name};
}

/** @constructor */
Person.prototype.Child = function(age) {
	/** the Child's age */
	this.age = age;
}