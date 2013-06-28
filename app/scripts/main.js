$('body').focus();

var $lettering = $('.lettering'),
		$cursor 	 = $('i#cursor'),
		selectedText;

$lettering.on('click', 'span', function(event) {
	var $span = $(this);
	if ($span.width() / 2 > event.offsetX) $cursor.insertBefore( $span );
	else $cursor.insertAfter( $span );
})

$('body').on('mouseup', function() {
	selectedText = window.getSelection();
	if (selectedText.getRangeAt(0).toString() == '') selectedText = null;
});


// letters + their sizes
var letterEl = function (letter) { return '<span><b>' + letter + '</b></span>' };

var Letter = function (character) {	
	this.character = character;
	this.baseWidth = this.measure();
	this.$el = $( letterEl(character) );
}

Letter.prototype.measure = function () {
	var letter = this.character;
	if (letter == ' ') letter = 'I';
	return $('#ruler').html(letter).width()
}

var Cursor = {
	getPosition: function() {		
	}
}

var Lettering = (function() {
	var letters = [],  timeInsertStarted,  lastInsert;

	return {
		get: function(position) {
			return letters[position]
		},
		startInserting: function (letter) {
			// Cursor.getPosition();
			// fix
			letters.push( letter )
			lastInsert = letter;
			letter.startTime = timeInsertStarted = Date.now();
		},
		stopInserting: function () {
			timeInsertStarted = null;
		},
		remove: function(position) {

		},
		removeRange: function(a, b) {

		},
		getRow: function(n) {

		},
		currentlyInserting: function() {
			if (timeInsertStarted) return lastInsert;
			else return false;
		}
	}
}());

var welcomeText = 'hey-there,-this-is-some-weirdness.-get-involved.-pad-pad-123-123';



function insertLetter( character ) {
	var letter = new Letter( character );
	Lettering.startInserting( letter );
	// view
	letter.$el.insertBefore( $cursor  )
}

_( welcomeText.split('') ).each( insertLetter );

setTimeout( Lettering.stopInserting, 240 ) 



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

window.onkeypress = function(k) {
	if (String.fromCharCode(k.which) == '') return; // weird empty events
	// repeated event
	var current = Lettering.currentlyInserting();
	if (current && current.character == String.fromCharCode(k.which)) return;

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
	Lettering.stopInserting()
}

window.onblur = function() {
	Lettering.stopInserting()
};

var loop = setInterval(function() {
	var current = Lettering.currentlyInserting();
	if (current) {
		var scale = Math.pow(1 + (Date.now() - current.startTime) / 700, 2);
		current.$el.css({
			width: scale * current.baseWidth
		})
		current.$el.find('b').css({
			transform: 'scale(' + scale + ')'
		});
	}
}, 10);

var stopProp = function(e) { e.stopPropagation() };
$('input').on('keypress', stopProp)
          .on('keydown',  stopProp)
          .on('keyup',    stopProp);

