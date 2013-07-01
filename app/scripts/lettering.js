/////////////////////////
// Lettering singleton

var Lettering = (function() {
	var timeInsertStarted,  lastInsert;

	var distance = function(a, b) {
		var topOffset  = Math.abs(a.top - b.top ),
		    leftOffset = Math.abs(a.left - b.left );
		return topOffset + leftOffset
	};

	return {
		letters: [],
		$el: $('.lettering'),
		getUp: function(position) {
			var above = this.inDirection(this.letters, position, true)
			return this.nearest(above, position)[0]
		},
		getDown: function(position) {
			var below = this.inDirection(this.letters, position, false)
			return this.nearest(below, position)[0]
		},
		inDirection: function (letters, position, up) {
			return _.filter(letters, function(letter) {
				if (up) {
					return letter.$el.position().top + 40 < position.top
				} else {
					return letter.$el.position().top > position.top
				}
			})
		},
		nearest: function(letters, position) {
			return _.sortBy(letters, function(letter) {
				return distance(letter.$el.position(), position)
			})
		},
		get: function(index) {
			return this.letters[index]
		},
		startInserting: function (letter) {
			this.letters.splice( Cursor.getPosition(), 0, letter )
			lastInsert = letter;
			letter.startTime = timeInsertStarted = Date.now();
		},
		stopInserting: function () {
			timeInsertStarted = null;
		},
		remove: function(index) {
			this.letters.splice( index, 1 )
		},
		removeRange: function(range) {
			function letterLevel (el) {
				// if (el)
			}

			console.log(range.startContainer)
			console.log(range.endContainer)
		},
		currentlyInserting: function() {
			if (timeInsertStarted) return lastInsert;
			else return false;
		}
	}
}());

Lettering.$el.on('click', 'span', function(event) {
	var $span = $(this);
	if ($span.width() / 2 > event.offsetX) Cursor.$el.insertBefore( $span );
	else Cursor.$el.insertAfter( $span );
})