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

;(function(window, _, Benchmark, ll, undefined) {
	var perfectRunner = (function(options) {
		'use strict';

		var _p = {
			/**
			 * The default options copied by perfect instances.
			 *
			 * @static
			 * @memberOf PerfectRunner
			 * @type Object
			 */
			options: {
				/**
				 * The path to the library to test.
				 *
				 * @memberOf PerfectRunner.options
				 * @type String
				 */
				'target': undefined,

				/**
				 * Only the tests whose names are in this list will be executed.
				 * If the list is empty, then all tests will be executed, with the
				 * exception of those listed in the `exclude` option.
				 *
				 * @memberOf PerfectRunner.options
				 * @type Array
				 */
				'include': [],

				/**
				 * Tests to be excluded. This options is taken into consideration
				 * only if the `include` option is empty.
				 *
				 * @memberOf PerfectRunner.options
				 * @type Array
				 */
				'exclude': [],

				/**
				 * A boolean value that specifies whether the target library should be
				 * lazy loaded. You may want to set this to `false` if you have
				 * linked to the target library in your HTML code.
				 *
				 * @memberOf PerfectRunner.options
				 * @type Boolean
				 */
				'lazyload': true,

				/**
				 * Either 'a' or 'b', this value expresses wather this Runner represent the 'a'
				 * iteration or the 'b' iteration.
				 *
				 * @memberOf PerfectRunner.options
				 * @type String
				 */
				'role': undefined,

				/**
				 * An instance of Mediator used to publish messages.
				 *
				 * @memberOf PerfectRunner.options
				 * @type Object
				 */
				'mediator': undefined
			},

			f: {
				/**
				 * A dictionary comprising of a test name and a function that cleans up
				 * after the test has cycled.
				 *
				 * @memberOf PerfectRunnerModule
				 * @type Object
				 */
				teardownFunctions: {},

				testIncluded: function(name) {
					if (_.indexOf(_p.options.include, name) >= 0) return true;
					if (_p.options.include.length === 0 &&
						_.indexOf(_p.options.exclude, name) < 0) return true;

					return false;
				},

				onStart: function() {
					_p.options.mediator.publish("log", "PerfectRunner", "Started");
					_p.options.mediator.publish("start", _p.options.role);
				},

				onCycle: function(e) {
					if (e.target.error) {
						_p.options.mediator.publish("log", "error", "PerfectRunner", e.target.error.message);
						return;
					}
					_p.options.mediator.publish("log", "PerfectRunner", "Cycled");
					_p.options.mediator.publish("log", "PerfectRunner", e.target);
					_p.options.mediator.publish("cycle", _p.options.role, e);
				},

				onComplete: function() {
					_p.options.mediator.publish("log", "PerfectRunner", "Completed");
					_p.options.mediator.publish("complete", _p.options.role);
				}
			}
		};

		_.extend(_p.options, options);

		return {
			/** Adds a test to the suite.
			 *
			 * @memberOf Perfect
			 */
			add: function(name, fn, teardown) {
				if (!_p.f.testIncluded(name)) {
					_p.options.mediator.publish("log", "PerfectRunner", "Ignoring excluded test: " + name);
					return this;
				}

				if (_p.suite === undefined) {
					_p.suite = new Benchmark.Suite();
				}

				if (teardown === undefined) {
					teardown = function() {};
				}

				_p.suite.add(name, {
					'fn': fn,
					'onComplete': _.bind(teardown, this)
				});

				return this;
			},

			/**
			 * Runs the suite against both versions of the target library.
			 *
			 * @memberOf Perfect
			 */
			run: function() {
				var self = this;

				_p.options.mediator.publish("log", "PerfectRunner", "Running " + _p.options.target)

				if (_p.suite === undefined) {
					_p.options.mediator.publish("log", "error", "PerfectRunner", "Add some tests first.");
					return;
				}

				_p.suite.on('start', _.bind(_p.f.onStart, this));
				_p.suite.on('cycle', _.bind(_p.f.onCycle, this));
				_p.suite.on('complete', _.bind(_p.f.onComplete, this));

				if (_p.options.lazyload) {
					ll.js(_p.options.target, function() {
						self.publish && self.publish("log",
							"PerfectRunner", "Target loaded: " + _p.options.target);
						_p.suite.run();
					});
				} else {
					_p.suite.run();
				}
			},

			target: function() {
				return _p.options.target;
			}
		};
	});

	window.PerfectRunner = perfectRunner;
}(this, _, Benchmark, LazyLoad));
