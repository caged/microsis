/**
 * Construct a new exception.
 * @constructor
 * @class Class from which all other exceptions should be extended.
 * 
 * @param {Object} sMessage a textual description of the exception
 * @param {Object} sCallStack a call stack typically created with <code>generateCallStack</code>
 */
my.fwork.Exception = function(sMessage, sCallStack)
{
	this.m_sMessage = sMessage + "\n\nCall Stack:\n" + sCallStack;
}