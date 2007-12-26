
/** 
 * Process the text. 
 * @return	{Array,
			String}
 */
 
function processText(text, processor) {
	return processor(text);
}

/** 
 * @return {null} If there was a problem.
 * @return {number} The number of bytes written to disk.
 */
 
function flush(buffer, filepath) {
	// do stuff
}

/** 
 * @returns {Array} Characters from the file.
 */
 
function readText(filepath) {
	// do stuff
}