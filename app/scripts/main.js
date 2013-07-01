$('body').focus();

$('body').on('mouseup', function() {
	Lettering.selectedText = window.getSelection();
	if (Lettering.selectedText.getRangeAt(0).toString() == '') {
		Lettering.selectedText = null
	}
});

// do something

var config = {
	letterSize: 24,
	cssZoom: true
}

if (config.cssZoom) {
	$('body').addClass('cssZoom');
}
$('div.lettering, #ruler').css({ fontSize: config.letterSize })

var welcomeText = 'The Range object represents a fragment of a document that can contain nodes and parts of text nodes in a given document.';

function insertLetter( character ) {
	var letter = new Letter( character );
	Lettering.startInserting( letter );
	letter.$el.insertBefore( Cursor.$el )
}

var initialMessageAsync = Lazy( welcomeText.split('') ).async( 50 );

initialMessageAsync.each(function(letter) {
	insertLetter( letter );
	setTimeout( Lettering.stopInserting, Math.random() * 100 );
});

var commands = {
	cursor: {
		up:    Cursor.up,
		down:  Cursor.down,
		left:  Cursor.left,
		right: Cursor.right
	},
	del:function() {
		Lettering.remove( Cursor.getPosition() )
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
	else if (current) Lettering.stopInserting();

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
		// Lettering.$el.append( '<br>' )
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

		if (config.cssZoom) {
			current.$el.css({
				width: scale * current.baseWidth
			})
			current.$el.find('b').css({
				transform: 'scale(' + scale + ')'
			});						
		} else {
			current.$el.find('b').css({
				fontSize: 24 * scale
			});
		}

	}
}, 10);

var stopProp = function(e) { e.stopPropagation() };
$('input').on('keypress', stopProp)
          .on('keydown',  stopProp)
          .on('keyup',    stopProp);

