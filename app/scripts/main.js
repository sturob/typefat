$('body').focus();

$('body').on('mouseup', function() {
	Lettering.selectedText = window.getSelection();
	if (Lettering.selectedText.getRangeAt(0).toString() == '') {
		Lettering.selectedText = null
	}
});

// do something

var welcomeText = 'hey-there,-this-is-some weirdness.-get-involved.-pad-pad-123-123';

function insertLetter( character ) {
	var letter = new Letter( character );
	Lettering.startInserting( letter );
	// view
	letter.$el.insertBefore( Cursor.$el )
}

var initialMessageAsync = Lazy( welcomeText.split('') )//.async( 0 );

initialMessageAsync.each(function(letter) {
	insertLetter( letter );
	setTimeout( Lettering.stopInserting, Math.random() * 200 );
});



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
			var cursorPos = Cursor.$el.position();

			var $higherEls = function() { 
				return $(this).position().top + 50 < cursorPos.top 
			}
			window.letters = getLetters( $higherEls );

			var newPos = _.reduce(letters, function(best, letter) {
				var isCloser = distance(letter, cursorPos) < distance(best, cursorPos);
			  return isCloser ? letter : best;
			}, { top: 0, left: 0 });

			Cursor.$el.insertBefore( newPos.$el )
		},
		down:function() {
			var cursorPos = Cursor.$el.position();

			var $lowerEls = function() { 
				return $(this).position().top  > cursorPos.top 
			}

			window.letters = getLetters( $lowerEls );

			var newPos = _.reduce(letters, function(best, letter) {
				var isCloser = distance(letter, cursorPos) < distance(best, cursorPos);
			  return isCloser ? letter : best;
			}, { top: 0, left: 0 });

			Cursor.$el.insertBefore( newPos.$el )
		},
		left: Cursor.left,
		right: Cursor.right
	},
	del:function() {
		Cursor.$el.next().remove()
	},
	backspace:function() { // change 'hold down behavour to explode
		if (Lettering.selectedText) {
			Lettering.removeRange(  Lettering.selectedText.getRangeAt(0) )
			Lettering.selectedText.getRangeAt(0).deleteContents()
		} else {
			Lettering.remove( Cursor.getPosition() - 1 )
			Cursor.$el.prev().remove()
		}
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
	// log k.which + modifiers
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

