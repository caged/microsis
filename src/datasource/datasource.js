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
  }
});