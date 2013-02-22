/*!
 * Perfect.js v0.1 <https://github.com/siovene/perfectjs>
 * Author: Salvatore Iovene <salvatore.iovene@intel.com>
 *
 * This software is licensed under the MIT licence (as defined by the OSI at
 * http://www.opensource.org/licenses/mit-license.php)
 *
 * ***************************************************************************
 * Copyright (C) 2013 by Intel Corporation Ltd.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a
 * copy of this software and associated documentation files (the "Software"),
 * to deal in the Software without restriction, including without limitation
 * the rights to use, copy, modify, merge, publish, distribute, sublicense,
 * and/or sell copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 * DEALINGS IN THE SOFTWARE.
 * ***************************************************************************
 */

;(function(window, _, ll, undefined) {
	'use strict';

	/**
	 * The Perfect constructor.
	 *
	 * @constructor
	 * @param {String} name A name to identify the performance testing group.
	 * @param {Object} [options={}] Options object.
	 */
	function Perfect(options) {
		var self = this;

		// allow instance creation without the `new` operator
		if (self == null || self.constructor != Perfect) {
			return new Perfect(options);
		}

		self.runOptions = {async: true};
		self.setOptions(options);
	}

	/* ---------------------------------------------------------------------- */
	/* Options and other data. */

	_.extend(Perfect.prototype, {
		/**
		 * The default options copied by perfect instances.
		 *
		 * @static
		 * @memberOf Perfect
		 * @type Object
		 */
		'options': {
			/**
			 * The name of the testing group.
			 *
			 * @memberOf Perfect.options
			 * @type String
			 */
			'name': undefined,

			/**
			 * The path to the first version of the library to test.
			 *
			 * @memberOf Perfect.options
			 * @type String
			 */
			'a': undefined,

			/**
			 * The path to the second version of the library to test.
			 *
			 * @memberOf Perfect.options
			 * @type String
			 */
			'b': undefined,

			/**
			 * The Benchmarkjs Suite to run against the library.
			 *
			 * @memberOf Perfect.options
			 * @type Object
			 */
			'suite': undefined,

			/**
			 * A callback run at the start of the Benchmark suite.
			 * @memberOf Perfect.options
			 * @type Function
			 */
			'start': undefined,

			/**
			 * A callback run after each test in the Benchmark suite.
			 * @memberOf Perfect.options
			 * @type Function
			 */
			'cycle': undefined,

			/**
			 * A callback run at the end of the Benchmark suite.
			 * @memberOf Perfect.options
			 * @type Function
			 */
			'complete': undefined,

			/**
			 * A callback run at the start of the Benchmark suite for `a`.
			 * @memberOf Perfect.options
			 * @type Function
			 */
			'start_a': undefined,

			/**
			 * A callback run after each test in the Benchmark suite for `a`.
			 * @memberOf Perfect.options
			 * @type Function
			 */
			'cycle_a': undefined,

			/**
			 * A callback run at the end of the Benchmark suite for `a`.
			 * @memberOf Perfect.options
			 * @type Function
			 */
			'complete_a': undefined,

			/**
			 * A callback run at the start of the Benchmark suite for `b`.
			 * @memberOf Perfect.options
			 * @type Function
			 */
			'start_b': undefined,

			/**
			 * A callback run after each test in the Benchmark suite for `b`.
			 * @memberOf Perfect.options
			 * @type Function
			 */
			'cycle_b': undefined,

			/**
			 * A callback run at the end of the Benchmark suite for `b`.
			 * @memberOf Perfect.options
			 * @type Function
			 */
			'complete_b': undefined,

			/**
			 * A boolean value that specifies whether the 'a' library should be
			 * lazy loaded. You may want to set this to `false` if you have
			 * linked to 'a' in your HTML code.
			 *
			 * @memberOf Perfect.options
			 * @type Boolean
			 */
			'lazyload_a': true,

			/**
			 * A boolean value that specifies whether the Perfect.UI library
			 * should be used.
			 */
			'enable_ui': true
		}
	});

	/* ---------------------------------------------------------------------- */
	/* Public functions. */

	_.extend(Perfect.prototype, {
		/**
		 * Runs the suite against both versions of the target library.
		 *
		 * @memberOf Perfect
		 */
		run: function() {
			var self = this;

			console.log("Perfect.run: entered.");

			if (self.options.lazyload_a) {
				ll.js(self.options.a, function() {
					console.log("Perfect.run: 'a' loaded: " + self.options.a);
					self.options.suite.run(self.runOptions);
				});
			} else {
				self.options.suite.run(self.runOptions);
			}
		},

		/**
		 * Sets the options with which Perfect is to run.
		 *
		 * @memberOf Perfect
		 */
		setOptions: function(options) {
			var self = this;

			_.extend(Perfect.prototype.options, options);

			if (self.options.suite !== undefined) {
				self._bindListeners({
					'start': ['_onStart', '_onStartA'],
					'cycle': ['_onCycle', '_onCycleA'],
					'complete': ['_onCompleteA']
				});
			}
		},

		/**
		 * The Perfect UI constructor.
		 *
		 * @constructor
		 */
		UI: function() {}
	});

	/* ---------------------------------------------------------------------- */
	/* Private functions. */

	_.extend(Perfect.prototype, {
		_bindListeners: function(data) {
			var self = this;

			_.map(data, function(listeners, eventName) {
				_.each(listeners, function(i) {
					self.options.suite.on(eventName, self[i].bind(self));
					if (self.options.enable_ui) {
						self.options.suite.on(eventName, self.UI[i].bind(self));
					}
				});
			});
		},

		_onStart: function(event) {
			console.log("Perfect._onStart: entered.");
			if (_.isFunction(this.options.start)) {
				this.options.start(event, this.options.suite);
			}
		},

		_onCycle: function(event, suite) {
			console.log("Perfect._onCycle: entered.");
			if (_.isFunction(this.options.cycle)) {
				this.options.cycle(event, this.options.suite);
			}
		},

		_onComplete: function(suite) {
			console.log("Perfect._onComplete: entered.");
			if (_.isFunction(this.options.complete)) {
				this.options.complete(this.options.suite);
			}
		},

		_onStartA: function(event) {
			console.log("Perfect._onStartA: entered.");
			if (_.isFunction(this.options.start_a)) {
				this.options.start_a(event, this.options.suite);
			}
		},

		_onCycleA: function(event, suite) {
			console.log("Perfect._onCycleA: entered.");
			if (_.isFunction(this.options.cycle_a)) {
				this.options.cycle_a(event, this.options.suite);
			}
		},

		_onCompleteA: function(suite) {
			var self = this;

			console.log("Perfect._onCompleteA: entered.");
			if (_.isFunction(this.options.complete_a)) {
				this.options.complete_a(this.options.suite);
			}

			if (this.options.suite !== undefined) {
				this.options.suite.off();
				this._bindListeners({
					'start': ['_onStartB'],
					'cycle': ['_onCycle', '_onCycleB'],
					'complete': ['_onCompleteB', '_onComplete']
				});
			}

			ll.js(this.options.b, function() {
				console.log(
					"Perfect._onCompleteA: 'b' loaded: " +
					self.options.b);
				self.options.suite.run(self.runOptions);
			});
		},

		_onStartB: function(event) {
			console.log("Perfect._onStartB: entered.");
			if (_.isFunction(this.options.start_b)) {
				this.options.start_b(event, this.options.suite);
			}
		},

		_onCycleB: function(event, suite) {
			console.log("Perfect._onCycleB: entered.");
			if (_.isFunction(this.options.cycle_b)) {
				this.options.cycle_b(event, this.options.suite);
			}
		},

		_onCompleteB: function(suite) {
			console.log("Perfect._onCompleteB: entered.");
			if (_.isFunction(this.options.complete_b)) {
				this.options.complete_b(this.options.suite);
			}

			if (this.options.suite !== undefined) {
				this.options.suite.off();
			}
		}
	});

	_.extend(Perfect.prototype.UI, {
		_onStart: function(event) {
			console.log("Perfect.UI.onStart: entered.");
		},

		_onCycle: function(event) {
			console.log("Perfect.UI.onCycle: entered.");
			console.log(event.target.hz);
		},

		_onComplete: function(event) {
			console.log("Perfect.UI.onComplete: entered.");
		},

		_onStartA: function(event) {
			console.log("Perfect.UI.onStartA: entered.");
		},

		_onCycleA: function(event) {
			console.log("Perfect.UI.onCycleA: entered.");

			var $template = $(
				'<tr>' +
					'<td class="number"></td>' +
					'<td class="name"></td>' +
					'<td class="hz_a"></td>' +
                    '<td class="hz_b">...</td>' +
					'<td class="diff">...</td>' +
				'</tr>');

			$template.attr('id', event.target.id);
			$template.find('.number').text(event.target.id);
			$template.find('.name').text(event.target.name);
			$template.find('.hz_a')
				.text(event.target.hz / 1000.0)
				.attr('data-value', event.target.hz);

			$('table#perfect tbody').append($template);
		},

		_onCompleteA: function(event) {
			console.log("Perfect.UI.onCompleteA: entered.");
		},

		_onStartB: function(event) {
			console.log("Perfect.UI.onStartB: entered.");
		},

		_onCycleB: function(event) {
			console.log("Perfect.UI.onCycleB: entered.");

			var $row = $('table#perfect').find('tr#' + event.target.id),
			    hz_a = parseFloat($row.find('td.hz_a').attr('data-value')),
				hz_b = event.target.hz,
				diff = (hz_a - hz_b) / hz_a;

			$row.find('td.hz_b')
				.text(hz_b / 1000.0)
				.attr('data-value', hz_b);

			$row.find('td.diff').text(diff + '%');
		},

		_onCompleteB: function(event) {
			console.log("Perfect.UI.onCompleteB: entered.");
		}
    });


	/* ---------------------------------------------------------------------- */
	/* Expose Perfect. */

	// some AMD build optimizers, like r.js, check for specific condition
    // patterns like the following:
	if (typeof define == 'function' && typeof define.amd == 'object' &&
	    define.amd) {
		// define as an anonymous module so, through path mapping, it can be
        // aliased
		define('perfect', ['underscore', 'LazyLoad'], function() {
            return Perfect;
        });
	}
	// check for `exports` after `define` in case a build optimizer adds an
	// `exports` object
	else if (window.freeExports) {
		// in Node.js or RingoJS v0.8.0+
		if (typeof module == 'object' && module &&
		    module.exports == this.freeExports) {
			(module.exports = Perfect).Perfect = Perfect;
		}
		// in Narwhal or RingoJS v0.7.0-
		else {
			window.freeExports.Perfect = Perfect;
		}
	}
	// in a browser or Rhino
	else {
		// use square bracket notation so Closure Compiler won't munge
		// `Perfect`
		// http://code.google.com/closure/compiler/docs/api-tutorial3.html#export
		window['Perfect'] = Perfect;
	}
}(this, _, LazyLoad));
