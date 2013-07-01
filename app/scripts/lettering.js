var Lettering = (function() {
	var timeInsertStarted,  lastInsert;

	return {
		letters: [],
		$el: $('.lettering'),
		get: function(position) {
			return this.letters[position]
		},
		startInserting: function (letter) {
			this.letters.splice( Cursor.getPosition(), 0, letter )
			lastInsert = letter;
			letter.startTime = timeInsertStarted = Date.now();
		},
		stopInserting: function () {
			timeInsertStarted = null;
		},
		remove: function(position) {
			this.letters.splice( position, 1 )
		},
		removeRange: function(range) {
			function letterLevel (el) {
				// if (el)
			}

			console.log(range.startContainer)
			console.log(range.endContainer)
		},

		// getRow: function(n) {

		// },
		currentlyInserting: function() {
			if (timeInsertStarted) return lastInsert;
			else return false;
		},
		dump: function() {
			return _.map(this.letters, function(l) { return l.character }).join('');
		}
	}
}());

Lettering.$el.on('click', 'span', function(event) {
	var $span = $(this);
	if ($span.width() / 2 > event.offsetX) Cursor.$el.insertBefore( $span );
	else Cursor.$el.insertAfter( $span );
})