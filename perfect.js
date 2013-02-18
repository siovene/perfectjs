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
		if (self == null || self.constructor != Perfect) {
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
			 * A boolean value that specifies whther the 'a' library should be
			 * lazy loaded. You may want to set this to `false` if you have
			 * linked to 'a' in your HTML code.
			 *
			 * @memberOf Perfect.options
			 * @type Boolean
			 */
			'lazyload_a': true
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
		}
	});

	/* ---------------------------------------------------------------------- */
	/* Private functions. */

	_.extend(Perfect.prototype, {
		_bindListeners: function(data) {
			var self = this;

			_.map(data, function(listeners, eventName) {
				_.each(listeners, function(i) {
					self.options.suite.on(eventName, self[i].bind(self));
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

	/* ---------------------------------------------------------------------- */
	/* Expose Perfect. */

	window.Perfect = Perfect;
}(this, _, LazyLoad));
