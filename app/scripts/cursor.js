/////////////
// cursor

var Cursor = (function() {
	// var position = 0;
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
		}		
	}
}());
