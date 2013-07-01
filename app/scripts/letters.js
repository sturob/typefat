/////////////
// letter

var Letter = function (character) {	
	this.character = character;
	this.baseWidth = this.measure();
	this.$el = $( this.html() );
}

Letter.prototype.measure = function () {
	var letter = this.character;
	if (letter == ' ') letter = 'I';
	return $('#ruler').html(letter).width()
}

Letter.prototype.html = function () { 
	return '<span><b>' + this.character + '</b></span>'
}

Letter.prototype.toString = function() {
	return this.character
}
