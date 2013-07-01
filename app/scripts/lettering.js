var Lettering = (function() {
	var timeInsertStarted,  lastInsert;

	var distance = function(a, b) {
		return Math.sqrt( Math.abs(a.left - b.left) * Math.abs(a.top - b.top) )
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

		// getLettersAbove: function(index) {
		// 	var cursorTop = Cursor.$el.position().top;
		// 	return _.chain(this.letters).filter( function(letter) {
		// 	         return letter.$el.position().top + 50 < cursorTop
		// 	       }).map(function(letter) {
		// 	       	 var pos = letter.$el.position()
		// 			     return {
		// 				     $el: letter.$el,  top: pos.top,  left: pos.left
		// 		       }
		// 		     });
		// },
		// getLettersBelow: function(index) {

		// },
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