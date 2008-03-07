/**
 * Copyright (c) 2007 Justin Palmer. All Rights Reserved
 * Licensed under BSD license
 * Version 0.1.0
 */

/**
 * A powerful interface for accessing different types of data.
 * Data can come from be local such as Arrays and JSON or returned 
 * remoteley from an XHR request.
 * @namespace MICROSIS.util
 * @requires microsis
 * @title Datasource Utility
 */
 
/**
 * @class DataSource
  * @constructor
  * @param oLiveData {Object} Pointer to a live database
  * @param oConfigs {Object} (optional) Configuration hash
 */
MICROSIS.util.DataSource = Class.create({
  
  initialize: function(oLiveData, oConfigs) {
    
    this._sName = null;
    this._aCache = null;
    this._oQueue = null;
    this._aIntervals = null;
    
    this.maxCacheEntries = 0;
    this.liveData = null;
    this.dataType = MICROSIS.util.TYPE_UNKNOWN;
    this.responseType = MICROSIS.util.TYPE_UNKNOWN;
    this.responseSchema = null;
    this.connMgr = null;
    this.connXhrMode = "allowAll";
    this.connMethodPost = false;
    this.connTimeout = 0;
    
    if(oConfigs && (oConfigs.constructor == Object)) {
      Object.extend(this, oConfigs);
    }
    
    if(!oLiveData) return;
    
    if(oLiveData.nodeType && oLiveData.nodeType == 9) {
      this.dataType = MICROSIS.util.DataSource.TYPE_XML;
    } else if(Object.isArray(oLiveData)) {
      this.dataType = MICROSIS.util.DataSource.TYPE_JSARRAY;
    } else if(Object.isString(oLiveData)) {
      this.dataType = MICROSIS.util.DataSource.TYPE_XHR;
    } else if(Object.isFunction(oLiveData)) {
      this.dataType = MICROSIS.util.DataSource.TYPE_JSFUNCTION;
    } else if(oliveData.nodeName && (oLiveData.nodeName.toLowerCase() == "table")) {
      this.dataType = MICROSIS.util.DataSource.TYPE_HTMLTABLE;
    } else if(Object.isObject(oLiveData)) {
      this.dataType = MICROSIS.util.DataSource.TYPE_JSON;
    } else {
      this.dataType = MICROSIS.util.DataSource.TYPE_UNKNOWN;
    }
    
    this.liveData = oLiveData;
    this._oQueue = {interval: null, conn: null, request: []};
    
    // Validate and initialize public configuration
    var maxCacheEntries = this.maxCacheEntries;
    if(!Object.isNumber(maxCacheEntries) || (maxCacheEntries < 0))
      maxCacheEntries = 0;
      
    // Initialize local cache
    if(maxCacheEntries > 0 && !this._aCache)
      this._aCache = [];
      
    // Initialized interval tracker
    this._aIntervals = [];
    
    this._sName = "DataSource instance" + MICROSIS.util.DataSource._nIndex;
    MICROSIS.util.DataSource._nIndex++;
    
    /**
     * Fired when a request is made to the local cache
     * @event cacheRequestEvent
     * @param oArgs.request {Object} The request object
     * @param oArgs.callback {Function} The callback function
     * @param oArgs.caller {Object}  The parent object of the callback function
     */
    this.createEvent("cacheRequestEvent");
    
    /**
     * Fired when data is retrieved from the local cache.
     *
     * @event getCachedResponseEvent
     * @param oArgs.request {Object} The request object.
     * @param oArgs.response {Object} The response object.
     * @param oArgs.callback {Function} The callback function.
     * @param oArgs.caller {Object} The parent object of the callback function.
     * @param oArgs.tId {Number} Transaction ID.
     */
    this.createEvent("cacheResponseEvent");

    /**
     * Fired when a request is sent to the live data source.
     *
     * @event requestEvent
     * @param oArgs.request {Object} The request object.
     * @param oArgs.callback {Function} The callback function.
     * @param oArgs.caller {Object} The parent object of the callback function.
     */
    this.createEvent("requestEvent");

    /**
     * Fired when live data source sends response.
     *
     * @event responseEvent
     * @param oArgs.request {Object} The request object.
     * @param oArgs.response {Object} The raw response object.
     * @param oArgs.callback {Function} The callback function.
     * @param oArgs.caller {Object} The parent object of the callback function.
     */
    this.createEvent("responseEvent");

    /**
     * Fired when response is parsed.
     *
     * @event responseParseEvent
     * @param oArgs.request {Object} The request object.
     * @param oArgs.response {Object} The parsed response object.
     * @param oArgs.callback {Function} The callback function.
     * @param oArgs.caller {Object} The parent object of the callback function.
     */
    this.createEvent("responseParseEvent");

    /**
     * Fired when response is cached.
     *
     * @event responseCacheEvent
     * @param oArgs.request {Object} The request object.
     * @param oArgs.response {Object} The parsed response object.
     * @param oArgs.callback {Function} The callback function.
     * @param oArgs.caller {Object} The parent object of the callback function.
     */
    this.createEvent("responseCacheEvent");
    /**
     * Fired when an error is encountered with the live data source.
     *
     * @event dataErrorEvent
     * @param oArgs.request {Object} The request object.
     * @param oArgs.callback {Function} The callback function.
     * @param oArgs.caller {Object} The parent object of the callback function.
     * @param oArgs.message {String} The error message.
     */
    this.createEvent("dataErrorEvent");

    /**
     * Fired when the local cache is flushed.
     *
     * @event cacheFlushEvent
     */
    this.createEvent("cacheFlushEvent");
  },
  
  toString: function() {
    return this._sName;
  },
  
  getCachedResponse: function(oRequest, oCallback, oCaller) {
    var aCache = this._aCache;
    var nCacheLength = aCache ? aCache.length : 0;
    var oResponse = null;
  }
});

Object.extend(MICROSIS.util.DataSource.prototype, MICROSIS.util.EventProvider);

Object.extend(MICROSIS.util.DataSource, {
  TYPE_UNKNOWN: -1,
  TYPE_JSARRAY: 0,
  TYPE_JSFUNCTION: 1,
  TYPE_XHR: 2,
  TYPE_JSON: 3,
  TYPE_XML: 4,
  TYPE_TEXT: 5,
  TYPE_HTMLTABLE: 6,
  ERROR_DATAINVALID: "Invalid data",
  ERROR_DATANULL: "Null data",
  _nIndex: 0,
  _nTransactionId: 0
  
  parseNumber: function(oData) {
    var number = oData * 1;
    
    if(Object.isNumber(number))
      return number;
    else
      return null;
  },
  
  parseDate: function(oData) {
    var date = null;
    
    if(!(oData instanceof Date))
      date = new Date(oData);
    else
      return oData;
      
    if(data instanceof Date)
      return date;
    else
      return null;
  }
});