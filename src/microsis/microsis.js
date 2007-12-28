/**
 * Copyright (c) 2007 Justin Palmer. All Rights Reserved
 * Licensed under BSD license
 * Version 0.1.0
 */

/**
 * Microsis is largely based off of the principles of YUI widget development.
 * Some components are derived from and/or ported from YUI's on implementation.
 */
 
if(typeof MICROSIS == "undefined" || !MICROSIS) {
  /**
   * MICROSIS is the module in which all classes, widgets and methods are contained.
   * At the moment I'm using JSDoc to document the code.
   * @class MICROSIS
   * @static
   */
  var MICROSIS = {};
}

  /**
  * Creates and returns the namespace specified.
  * <pre>
  * MICROSIS.namespace('foo.bar');
  * MICROSIS.namespace('MICROSIS.foo.bar');
  * </pre>
  * Both of the namespaces above would return the same thing because
  * MICROSIS is not allowed in the namespace twice and thus it falls back
  * to the next item
  * 
  * Watch out for reserved words as defined by ECMAScript
  * 
  * @method namespace
  * @static
  * @param {String*} 1..n namespaces to create
  * @return {Object} The last object created
  */
MICROSIS.namespace = function() {
  var a = $A(arguments), obj = MICROSIS, parts;
  a.each(function(arg) {
    parts = arg.split('.');
    parts.without('MICROSIS').each(function(part) {
      obj[part] = obj[part] || {};
      obj = obj[part];
    })
  })
  return obj;
};
  
(function() {
  MICROSIS.namespace('util', 'widget');
  Object.isObject = function(o) {
    return (o && (typeof o == "object" || Object.isFunction(o))) || false;
  }
})();
