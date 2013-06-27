// var myApp = angular.module('myApp', []);

// up    = function(){}
// left  = function(){}
// right = function(){}
// down  = function(){}

var $lettering = $('.lettering');
		$cursor = $('i#cursor');

var letterEl = function (letter) { return '<span><b>' + letter + '</b></span>' };

var measureLetter = function (letter) {
	if (letter == ' ') letter = 'I';
	return $('#ruler').html(letter).width()
}

var insertion = {
	startTime: 0,
	width: 0,
	$el: null,
	letter: ''
}

window.onkeypress = function(k) {
	// repeated event
	if (insertion.$el && insertion.letter == String.fromCharCode(k.which)) return;

	insertion.startTime = Date.now()
	insertion.letter = String.fromCharCode( k.which )
	insertion.width = measureLetter( insertion.letter )
	insertion.$el= $( letterEl( insertion.letter ) )
	insertion.$el.insertBefore( $cursor  )
};

window.onkeydown = function(k) {
	if (k.which == 8) {
		$lettering.find('span').last().remove()
		return false;
	}
}

window.onkeyup = function (k) {
	// console.log( k.which )
	if (k.which == 13) {
		$lettering.append( '<br>' )
	}
	insertion.$el = null;
}

window.onblur = function() {
	insertion.$el = null;
};

var loop = setInterval(function() {
	if (insertion.$el) {
		var scale = Math.pow(1 + (Date.now() - insertion.startTime) / 1000, 2);
		insertion.$el.css({
			width: scale * insertion.width
		})
		insertion.$el.find('b').css({
			transform: 'scale(' + scale + ')'
		});
	}
}, 10);

var stopProp = function(e) { e.stopPropagation() };
$('input').on('keypress', stopProp)
          .on('keydown',  stopProp)
          .on('keyup',    stopProp);
