// var myApp = angular.module('myApp', []);

$('body').focus();

var $lettering = $('.lettering'),
		$cursor 	 = $('i#cursor'),
		selectedText;

$lettering.on('click', 'span', function(event) {
	var $span = $(this);
	
	if ( $span.width() / 2 > event.offsetX ) $cursor.insertBefore( $span );
	else $cursor.insertAfter( $span );
})

$('body').on('mouseup', function() {
	selectedText = window.getSelection();
	if (selectedText.getRangeAt(0).toString() == '') selectedText = null;
})

var letterEl = function (letter) { return '<span><b>' + letter + '</b></span>' };

var welcomeText = 'hey-there,-this-is-some-weirdness.-get-involved.-pad-pad-123-123';

var measureLetter = function (letter) {
	if (letter == ' ') letter = 'I';
	return $('#ruler').html(letter).width()
}

var distance = function(a, b) {
	return Math.sqrt( Math.abs(a.left - b.left) * Math.abs(a.top - b.top) )
};

function getLetters(filter) {
	return $('span').filter( filter ).map(function() {
		var $el = $(this), position = $el.position();
		return {
			$el: $el,  top: position.top,  left: position.left
		}
	})
}

var commands = {
	cursor: {
		up:function() {
			var cursorPos = $cursor.position();

			var $higherEls = function() { 
				return $(this).position().top + 50 < cursorPos.top 
			}
			window.letters = getLetters( $higherEls );

			var newPos = _.reduce(letters, function(best, letter) {
				var isCloser = distance(letter, cursorPos) < distance(best, cursorPos);
			  return isCloser ? letter : best;
			}, { top: 0, left: 0 });

			$cursor.insertBefore( newPos.$el )
		},
		down:function() {
			var cursorPos = $cursor.position();

			var $lowerEls = function() { 
				return $(this).position().top  > cursorPos.top 
			}

			window.letters = getLetters( $lowerEls );

			var newPos = _.reduce(letters, function(best, letter) {
				var isCloser = distance(letter, cursorPos) < distance(best, cursorPos);
			  return isCloser ? letter : best;
			}, { top: 0, left: 0 });

			$cursor.insertBefore( newPos.$el )
		},
		left:function() {
			$cursor.insertBefore( $cursor.prev() )
		},
		right:function() {
			$cursor.insertAfter( $cursor.next() )
		}		
	},
	del:function() {
		$cursor.next().remove()
	},
	backspace:function() { // change 'hold down behavour to explode
		if (selectedText) selectedText.getRangeAt(0).deleteContents()
		else $cursor.prev().remove()
	}
}

var insertion = {
	startTime: 0,
	width: 0,
	$el: null,
	letter: ''
}

function insertLetter( letter ) {
	insertion.startTime = Date.now()
	insertion.letter = letter;
	insertion.width = measureLetter( insertion.letter )
	insertion.$el= $( letterEl( insertion.letter ) )
	insertion.$el.insertBefore( $cursor  )		
}

_( welcomeText.split('') ).each( insertLetter );
insertion.$el = null;

window.onkeypress = function(k) {
	if (String.fromCharCode(k.which) == '') return; // weird empty events
	// repeated event
	if (insertion.$el && insertion.letter == String.fromCharCode(k.which)) return; 

	insertLetter( String.fromCharCode( k.which ) )
};

var ffalse = function() { return false }

window.onkeydown = function(k) {
	var codes = {
		8:  _.compose( ffalse, commands.backspace ),
		46: _.compose( ffalse, commands.del ),
		37: commands.cursor.left, 
		38: commands.cursor.up,
		39: commands.cursor.right,
		40: commands.cursor.down
	}

	if (codes[k.which]) return codes[k.which]()
}

window.onkeyup = function (k) {
	console.log( k.which )
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
		var scale = Math.pow(1 + (Date.now() - insertion.startTime) / 700, 2);
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

