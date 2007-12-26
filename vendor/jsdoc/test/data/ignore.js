/** @ignore */
function Log() {
	this.warn = function(msg) {
		notify(msg);
	}

}

function Action() {
	this.passTo = function(obj) {
		obj.actOn(this);
	}
	
	/** This is deprecated
	 * @ignore
	 */
	this.execute = function() {
		this._index.push(action);
	}
}

/**
 * For use by developers only!
 * @private
 */
function sortVars() {

}
