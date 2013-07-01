//////////////////////
// cursor singleton

var Cursor = (function() {
	return {
		$el: $('i#cursor'),
		getPosition: function() {
			return Lettering.$el.find('> *').toArray().indexOf( Cursor.$el[0] )
		},
		left: function() {
			Cursor.$el.insertBefore( Cursor.$el.prev() )
		},
		right: function() {
			Cursor.$el.insertAfter( Cursor.$el.next() )
		},
		up: function() {
			var toLetter = Lettering.getUp( Cursor.$el.position() )
			Cursor.$el.insertBefore( toLetter.$el )
		},
		down: function() {
			var toLetter = Lettering.getDown( Cursor.$el.position() )
			Cursor.$el.insertBefore( toLetter.$el )
		}
	}
}());
