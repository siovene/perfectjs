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

;(function(window, undefined) {
	'use strict';

	/**
	 * The Perfect constructor.
	 *
	 * @constructor
	 * @param {String} name A name to identify the performance testing group.
	 * @param {Objecþ} [options={}] Options object.
	 */
	function Perfect(options) {
		var self = this;

		// allow instance creation without the `new` operator
		if (self == null || self.constructor != Perfect) {
			return new Perfect(options);
		}

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
			var self = this,
			    runOptions = {async: true};

			console.log("Perfect.run: entered.");

			if (self.options.lazyload_a) {
				LazyLoad.js(self.options.a, function() {
					console.log("Perfect.run: 'a' loaded: " + self.options.a);
					self.options.suite.run(runOptions);
				});
			} else {
				self.options.suite.run(runOptions);
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
				_.map({'start': 'onStart',
					   'cycle': 'onCycle',
					   'complete': 'onComplete'}, function(fn, eventName) {
					self.options.suite.on(eventName, self[fn].bind(self));
				});
			}
		}
	});

	/* ---------------------------------------------------------------------- */
	/* Private functions. */

	_.extend(Perfect.prototype, {
		onStart: function(event) {
			console.log("Perfect.onStart: entered.");
			if (_.isFunction(this.options.start)) {
				this.options.start(event, this.options.suite);
			}
		},

		onCycle: function(event, suite) {
			console.log("Perfect.onCycle: entered.");
			if (_.isFunction(this.options.cycle)) {
				this.options.cycle(event, this.options.suite);
			}
		},

		onComplete: function(suite) {
			console.log("Perfect.onComplete: entered.");
			if (_.isFunction(this.options.complete)) {
				this.options.complete(this.options.suite);
			}

			/* TODO: now start testing version 'b'. */
		}
	});

	/* ---------------------------------------------------------------------- */
	/* Expose Perfect. */

	window.Perfect = Perfect;
}(this));
