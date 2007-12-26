var WH = {
	FLAG: {
		/**
		 * Is it a W3C standards-compliant browser?
		 */
		w3c: function() {
			return /** @scope WH.FLAG.w3c */ {
				level1: true,
				level2: true,
				getLevel: function () {
				}
			}
		}(),
		
		/**
		 * Get the version number.
		 */
		getVersion: function() {
		}
	}
}