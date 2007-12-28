/**
 * Copyright (c) 2007 Justin Palmer. All Rights Reserved
 * Licensed under BSD license
 * Version 0.1.0
 */
 
/**
  * The CustomEvent object allows you to create and subscribe to interesting 
  * moments within your code.  You can define events in one object and any number 
  * of different objects can subscribe to the event, including the object the event 
  * was created in.
 * @namespace MICROSIS.util
 */
 
/**
 * @class CustomEvent
 * @constructor
 * @param {String} name   The name of the custom event that is passed to a subscribers 
 *                        callback.
 * @param {Object} scope  The context the custom event is invoked from.  Defaults to 
 *                        the window object.
 */
MICROSIS.util.CustomEvent = Class.create({

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
     */
    this.scope = scope || window;
    
    
    this.subscribers = [];
    this.lastError = null;
  },
  
  subscribe: function(method, obj) {
    if(!method) {
      throw new Error("Invalid callback for " + this.name);
    }
    this.subscribers.push(new MICROSIS.util.Subscriber(method, obj));
  },
  
  unsubscribe: function(method, obj) {
    if(!method)
      return this.cancelSubscriptions();
    var nullified = false;  
    this.subscribers.each(function(subscriber, index) {
      if(subscriber && subscriber.isComposedOf(method, obj)) {
        this._unset(index);
        nullified = true;
      }
    }.bind(this));
    return nullified;
  },
  
  fire: function() {    
    var length = this.subscribers.length, 
        args = $A(arguments), 
        ret = true, rebuild = false;

    if(isNaN(length)) 
      return true;
    
    if(length == 0) 
      rebuild = true;
    
    this.subscribers.each(function(subscriber) {      
      try {
        console.log("ARGS INTERNAL", args);
        ret = subscriber.method.call(this.scope, args.first(), subscriber.obj);
      } catch(e) {
        this.lastError = e;
      }
      
      if(ret === false)
        return false;
        
    }.bind(this));
    
    if(rebuild) this.subscribers = this.subscribers.compact();
      
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

MICROSIS.util.Subscriber = Class.create({
  initialize: function(method, obj) {
    this.method = method;
    this.obj = obj;
  },
  
  isComposedOf: function(method, obj) {
    if(obj) return (this.method == method && this.obj == obj);
    else return (this.method == method);
  }
});

MICROSIS.util.EventProvider = {
  __events: null,
  __subscribers: null,
  
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
  
  cancelSubscriptions: function(name) {
    return this.unsubscribe(name);
  },
  
  createEvent: function(name, options) {
    var events = this.__events = this.__events || {};
    var subscribers = this.__subscribers = this.__subscribers || {};
    var opts = options || {};
    
    if(Object.isUndefined(events[name])) {
      var scope = opts.scope || this;
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
  
  fireEvent: function(name) {
    var args = $A(arguments);
    var events = this.__events = this.__events || {};
    var customEvent = events[name];
    if(!customEvent) return null;
    
    return customEvent.fire.apply(customEvent, args);
  }
};
