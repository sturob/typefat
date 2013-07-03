
$('body').focus();

$('body').on('mouseup', function() {
	if (window.getSelection().rangeCount == 1) {
		Lettering.selectedText = window.getSelection();		
	}
	if (Lettering.selectedText.getRangeAt(0).toString() == '') {
		Lettering.selectedText = null
	}
});

// do something

var config = { // font  max size  min size
	letterSize: 24,
	cssZoom: false
};

if (config.cssZoom) {
	$('body').addClass('cssZoom');
}
if (config.cssZoom) {
	config.letterAdjustment = function(letter, scale) {
		letter.$el.css({
			width: scale * current.baseWidth
		})
		letter.$el.find('b').css({
			transform: 'scale(' + scale + ')'
		});	
	}
} else {
	config.letterAdjustment = function(letter, scale) {
		letter.$el.find('b').css({
			fontSize: config.letterSize * scale,
			bottom: 0 - (config.letterSize * scale) / 4
		});
	}
}

$('div.lettering, #ruler').css({ fontSize: config.letterSize })

var welcomeText = 'The Range object represents a fragment of a document that can contain nodes and parts of text nodes in a given document.';

function insertLetter(character) {
	var letter = new Letter( character )
	Lettering.startInserting( letter )
	config.letterAdjustment( letter, 1 )
	letter.$el.insertBefore( Cursor.$el )
}

var initialMessageAsync = Lazy( welcomeText.split('') ).async( 0 );

initialMessageAsync.each(function (letter) {
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
		if (window.getSelection().rangeCount == 1) {
			Lettering.selectedText = window.getSelection();
		}
		if (Lettering.selectedText) {
			Lettering.removeRange( Lettering.selectedText.getRangeAt(0) )
		} else {
			Lettering.remove( Cursor.getPosition() - 1 )
			Cursor.$el.prev().remove()
		}
	}
}

window.onkeypress = function(k) {
	if (String.fromCharCode(k.which) == '') return; // any control keys
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
		config.letterAdjustment( current, scale );
	}
}, 10);

var stopProp = function(e) { e.stopPropagation() };
$('input').on('keypress', stopProp)
          .on('keydown',  stopProp)
          .on('keyup',    stopProp);

