/**
@constructor
*/
function LibraryItem() {
	this.reserve = function() {
	}
}

/**
@constructor
*/
function Junkmail() {
	this.annoy = function() {
	}
}

/**
@augments ThreeColumnPage
@augments LibraryItem
@inherits Junkmail.annoy
@constructor
*/
function NewsletterPage() {
	this.getHeadline = function() {
	}
}
