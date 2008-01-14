/**
 * Copyright (c) 2007 Justin Palmer. All Rights Reserved
 * Licensed under BSD license
 * Version 0.1.0
 */
 
/**
  * @fileOverview The CustomEvent object allows you to create and subscribe to interesting 
  * moments within your code.  You can define events in one object and any number 
  * of different objects can subscribe to the event, including the object the event 
  * was created in.
  * @namespace MICROSIS.util
  */
 
/**
 * @constructor
 * @param {String} name   The name of the custom event that is passed to a subscribers 
 *                        callback.
 * @param {Object} scope  The context the custom event is invoked from.  Defaults to 
 *                        the window object.
 */
MICROSIS.util.CustomEvent = Class.create(
  /** @scope MICROSIS.util.CustomEvent.prototype */
  {
  
  initialize: function(name, scope) {
    
    /**
     * The name of the custom event that is passed to a subscribers callback.
     * @property name
     * @type String
     */
    this.name = name;
    
    /**
     * The context in which the custom event is invoked from.  Defaults to the window
     * object.
     * @property scope
     * @type {Object}
     */
    this.scope = scope || window;
    
    /**
     * An array of subscribers
     * @property subscribers
     * @type {Array}
     */
    this.subscribers = [];
    
    /**
     * The last error thrown when trying to invoke a callback
     * @property lastError
     * @type {String}
     */
    this.lastError = null;
  },
  
  /**
   * Subscribe to a custom event
   * @param method {Function} The callback method to be executed when the event is fired.
   * @param obj {Object} The scope in which the callback should be executed.
   */
  subscribe: function(method, obj) {
    if(!method) {
      throw new Error("Invalid callback for " + this.name);
    }
    this.subscribers.push(new MICROSIS.util.Subscriber(method, obj));
  },
  
  /**
   * Remove a listener.  If a method isn't given, this will unsbuscribe all 
   * subscribers.
   * @param method {Function}  The method to remove subscribtions from.
   * @param obj {Object}  Optional parameter used to determine which listener to 
   *                      unsubscribe in the event you have listeners of the same name.
   */
  unsubscribe: function(method, obj) {
    if(!method)
      return this.unsubscribeAll();
    var nullified = false;  
    this.subscribers.each(function(subscriber, index) {
      if(subscriber && subscriber.isComposedOf(method, obj)) {
        this._unset(index);
        nullified = true;
      }
    }.bind(this));
    return nullified;
  },
  
  unsubscribeAll: function() {
    var i = 0;
    this.subscribers.each(function(sub, index) {
        this._unset(index)
        i = index;
    }.bind(this));
    
    this.subscribers = [];
    return i;
  },
  
  /**
   * Fire the custom event's callback, passing in the scope, arguments and the custom
   * object if it's supplied.
   * @param arguments {Object*} Arguments passed to the callback when it's executed.
   */
  fire: function() {    
    var length = this.subscribers.length, args = $A(arguments), 
        ret = true, rebuild = false;

    if(isNaN(length)) 
      return true;
    
    if(length == 0) 
      rebuild = true;
    
    this.subscribers.each(function(subscriber) {      
      try {
        ret = subscriber.method.call(this.scope,  args.first(), subscriber.obj);
      } catch(e) {
        this.lastError = e;
      }
      
      if(ret === false)
        return false;
        
    }.bind(this));
    
    if(rebuild) 
      this.subscribers = this.subscribers.compact();
      
    return true
  },
  
  _unset: function(index) {
    var sub = this.subscribers[index];
    if(sub) {
      delete sub.method;
      delete sub.obj;
    }
    this.subscribers[index] = null;
  }
  
});

/**
 * @constructor
 * @param method {Function} The method executed when the event is fired.
 * @param obj {Object} The object to be passed along when the event fires. 
 */
MICROSIS.util.Subscriber = Class.create(
  /** @scope MICROSIS.util.Subscriber.prototype */
  {
  
  /**
   * Initialize a subscriber
   */
  initialize: function(method, obj) {
    this.method = method;
    this.obj = obj;
  },
  
  /**
   * Determine if a subscriber is made up of a particular method and object.
   * @param method {Function} The method to check
   * @param obj {Object} An optional object to check (Used when having multiple subscribers
   *                     of the same name)
   */
  isComposedOf: function(method, obj) {
    if(obj) return (this.method == method && this.obj == obj);
    else return (this.method == method);
  }
});


/**
 * Provide event methods to mixin to classes.  These methods should be mixed into a 
 * classes prototype using Object.extend.
 * @class EventProvider
 * @static
 */
MICROSIS.util.EventProvider = {
  
  /**
   * Private member used to store custom events
   * @property __events
   * @type Object[]
   * @private
   */
  __events: null,
  
  /**
   * Private member used to store custom event subscribers
   * @property __subscribers
   * @type Object[]
   * @private
   */
  __subscribers: null,
  
  /**
   * Subscribe to a custom event
   * @param name {String} The name of the event to subscribe to.
   * @param method {Function} The callback to execute when the event fires.
   * @param obj {Object} The scope in which the callback is executed.
   */
  subscribe: function(name, method, obj) {
    this.__events = this.__events || {};
    var customEvent = this.__events[name];
    
    if(customEvent) {
      customEvent.subscribe(method, obj);      
    } else {
      var subscribers = this.__subscribers = this.__subscribers || {};
      if(!subscribers[name]) 
        subscribers[name] = [];
      
      subscribers[name].push({
        method: method,
        obj: obj
      });
    }
  },
  
  /**
   * Unsubscribe one or all listeners from an event
   * @param name {String}     The name of the event.  If this isn't supplied, the listener
   *                          will be removed from all active events.
   * @param method {Function} The subscribed callback to unsubscribe.  If this 
   *                          paramater isn't supplied, all listeners are unsubscribed.
   * @param object {Object}   Used to determine which object to unsubscribe a listerner
   *                          from in the event you have multiple listerns on an object's
   *                          prototype.
   */
  unsubscribe: function(name, method, obj) {
    this.__events = this.__events || {};
    var events = this.__events;
    if(name) {
      var customEvent = events[name];
      if(customEvent) {
        return customEvent.unsubscribe(method, obj);
      }
    } else {
      var ret = true;
      var hasOwnProp = !!Object.prototype.hasOwnProperty, yes = null;
      for(var prop in events) {
        if(hasOwnProp) {
          yes = events.hasOwnProperty(prop);
        } else {
          yes = !Object.isUndefined(events[prop]) && 
                events.constructor.prototype[prop] !== events[prop];
        }
        
        if(yes) {
          ret = ret && events[prop].unsubscribe(method, obj);
        }
      }
      return ret;
    }
    return false;
  },
  
  /**
   * Remove all listeners from the given event.  If a name isn't given, attempt to 
   * remove all listeners from all active events.
   * @param name {String} The name of the event to unsubscribe from.
   */
  unsubscribeAll: function(name) {
    return this.unsubscribe(name);
  },
  
  /**
   * Create a new custom event.
   * @param name {String} The name of the custom event.
   * @param scope {Object} The execution scope.
   */
  createEvent: function(name, scope) {
    var events = this.__events = this.__events || {};
    var subscribers = this.__subscribers = this.__subscribers || {};
    
    if(Object.isUndefined(events[name])) {
      scope = scope || this;
      var customEvent = new MICROSIS.util.CustomEvent(name, scope);
      events[name] = customEvent;
      var sub = subscribers[name];
      if(sub) {
        sub.each(function(subscriber) {          
          customEvent.subscribe(subscriber.method, subscriber.obj);
        });
      }
    }
    return events[name];
  },
  
  /**
   * Fire the event specified by name, executing in the scope that was passed to 
   * createEvent.
   * @param name {String} The name of the event to fire.
   * @param arguments {Object*} Arbitrary set of arguments to pass to the callback.
   */
  fireEvent: function(name) {
    var args = $A(arguments), name = args.shift();
    var events = this.__events = this.__events || {};
    var customEvent = events[name];
    if(Object.isUndefined(customEvent)) return null;
    
    return customEvent.fire.apply(customEvent, args);
  }
};
