/**
 * @constructor
 */
var myClass = function(arg) {
	/** This is a member. */
	this.myMember = arg;
	this.myMethod = function() {}
}

/**
 * @memberOf myClass
 */
myClass.staticFunction = function(a, b, c) {
}

myClass.prototype.anotherMethod = function() {
}

/**
 * @memberOf myClass
 */
myClass.cid = 123456;

/**
 * @return {string} If x is a string.
 * @return {number} If x is a number.
 */
function myUnnattached(x, y, z) {

}

/** @constructor */
function anotherUnnattached() {
	this.zap = function(n){}
}
