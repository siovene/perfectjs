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
				'mediator': {
					publish: function() {}
				},

				/**
				 * Callbacks for the start, cycle and complete events.
				 *
				 * @memberOf PerfectRunner.options
				 * @type Object
				 */
				'callbacks': {
					'start': undefined,
					'cycle': undefined,
					'complete': undefined
				}
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
					_.isFunction(_p.options.callbacks.start) && _p.options.callbacks.start();
				},

				onCycle: function(e) {
					if (e.target.error) {
						_p.options.mediator.publish("log", "error", "PerfectRunner", e.target.error.message);
						return;
					}
					_p.options.mediator.publish("log", "PerfectRunner", "Cycled");
					_p.options.mediator.publish("log", "PerfectRunner", e.target);
					_p.options.mediator.publish("cycle", _p.options.role, e);
					_.isFunction(_p.options.callbacks.cycle) && _p.options.callbacks.cycle(e);
				},

				onComplete: function() {
					_p.options.mediator.publish("log", "PerfectRunner", "Completed");
					_p.options.mediator.publish("complete", _p.options.role);
					_.isFunction(_p.options.callbacks.complete) && _p.options.callbacks.complete();
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
					return;
				}

				if (_p.suite === undefined) {
					_p.suite = new Benchmark.Suite();
				}

				if (teardown === undefined) {
					teardown = function() {};
				}

				return _p.suite.add(name, fn, {
					'onComplete': _.bind(teardown, this),
					'delay': 0.25, // This allows the UI to breathe,
					'async': true
				});
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
;/*!
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

;(function(window, _, Mediator, PerfectRunner, PerfectUI, undefined) {
	var perfect = (function(options) {
		var _p = {
			options: {
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
				 * Only the tests whose names are in this list will be executed.
				 * If the list is empty, then all tests will be executed, with the
				 * exception of those listed in the `exclude` option.
				 *
				 * @memberOf Perfect.options
				 * @type Array
				 */
				'include': [],

				/**
				 * Tests to be excluded. This options is taken into consideration
				 * only if the `include` option is empty.
				 *
				 * @memberOf Perfect.options
				 * @type Array
				 */
				'exclude': [],

				/**
				 * Callbacks for the start, cycle and complete events.
				 *
				 * @memberOf Perfect.options
				 * @type Object
				 */
				'callbacks': {
					'start': undefined,
					'cycle': undefined,
					'complete': undefined
				},

				/** Enables the in-built UI.
				 *
				 * @memberOf Perfect.options
				 * @type Boolean
				 */
				'enable_ui': false,

				/**
				 * A name for your test suite. It will be used by the default UI,
				 * if enabled.
				 *
				 * @memberOf Perfect.options
				 * @type String
				 */
				'name': '',

				/**
				 * A description for your test suite. It will be used by the default UI,
				 * if enabled.
				 *
				 * @memberOf Perfect.options
				 * @type String
				 */
				'description': ''
			},

			benchesA: {},
			benchesB: {},

			f: {
				log: function(level, scope, msg, channel) {
					var _level, _scope, _msg, _content;

					if (arguments.length == 2) {
						_level = "debug";
						_scope = "unknown";
						_msg = level;
					} else if (arguments.length == 3) {
						_level = "debug";
						_scope = level;
						_msg = scope;
					} else if (arguments.length == 4) {
						_level = level;
						_scope = scope;
						_msg = msg;
					} else {
						console.error("Perfect.log: invalid number of arguments.");
					}

					_content = _scope + ": " + _msg;

					if (_level == "warn") {
						console.warn(_content);
					} else if (_level == "error") {
						console.error(_content);
					} else if (_level == "info") {
						console.info(_content);
					} else if (_level == "debug") {
						console.debug(_content);
					} else {
						console.error("Perfect.log: invalid log level: " + level);
					}
				},

				init: function() {
					function createMediator() {
						if (_p.mediator === undefined) {
							_p.mediator = new Mediator();
							_p.mediator.subscribe("log", _p.f.log, {priority: 10});
							_p.mediator.subscribe("start", _p.f.onStart, {priority: 10});
							_p.mediator.subscribe("cycle", _p.f.onCycle, {priority: 10});
							_p.mediator.subscribe("complete", _p.f.onComplete, {priority: 10});
						}
					}

					function createUI() {
						if (_p.options.enable_ui && _p.ui === undefined) {
							_p.ui = new PerfectUI({
								name: _p.options.name,
								description: _p.options.description,
								mediator: _p.mediator
								});
							_p.mediator.subscribe("start", _p.ui.start, {priority: 20});
							_p.mediator.subscribe("cycle", _p.ui.cycle, {priority: 20});
							_p.mediator.subscribe("complete", _p.ui.complete, {priority: 20});
						}
					}

					function subscribeCallbacks() {
						if (_p.callbacksSubscribed)
							return;

						/* Start
						 * ***************************************************/

						if (_.isFunction(_p.options.callbacks.start)) {
							_p.mediator.subscribe("start", _p.options.callbacks.start, {
								predicate: function(role) { return role == 'a'; },
								priority: 30
							});
						}

						if (_.isFunction(_p.options.callbacks.start_a)) {
							_p.mediator.subscribe("start", _p.options.callbacks.start_a, {
								predicate: function(role) { return role == 'a'; },
								priority: 31
							});
						}

						if (_.isFunction(_p.options.callbacks.start_b)) {
							_p.mediator.subscribe("start", _p.options.callbacks.start_b, {
								predicate: function(role) { return role == 'b'; },
								priority: 32
							});
						}

						/* Cycle
						 * ***************************************************/

						if (_.isFunction(_p.options.callbacks.cycle)) {
							_p.mediator.subscribe("cycle",
								function(role, e) {
									_p.options.callbacks.cycle(e);
								},
								{
									priority: 30
								});
						}

						if (_.isFunction(_p.options.callbacks.cycle_a)) {
							_p.mediator.subscribe("cycle",
								function(role, e) {
									_p.options.callbacks.cycle_a(e);
								},
								{
									predicate: function(role, e) { return role == 'a'; },
									priority: 31
								});
						}

						if (_.isFunction(_p.options.callbacks.cycle_b)) {
							_p.mediator.subscribe("cycle",
								function(role, e) {
									_p.options.callbacks.cycle_b(e);
								},
								{
									predicate: function(role, e) { return role == 'b'; },
									priority: 32
								});
						}

						/* Complete
						 * ***************************************************/

						if (_.isFunction(_p.options.callbacks.complete)) {
							_p.mediator.subscribe("complete", _p.options.callbacks.complete, {
								predicate: function(role) { return role == 'b'; },
								priority: 32
							});
						}

						if (_.isFunction(_p.options.callbacks.complete_a)) {
							_p.mediator.subscribe("complete", _p.options.callbacks.complete_a, {
								predicate: function(role) { return role == 'a'; },
								priority: 30
							});
						}

						if (_.isFunction(_p.options.callbacks.complete_b)) {
							_p.mediator.subscribe("complete", _p.options.callbacks.complete_b, {
								predicate: function(role) { return role == 'b'; },
								priority: 31
							});
						}

						_p.callbacksSubscribed = true;
					}

					function createRunnerA() {
						if (_p.a === undefined) {
							_p.a = new PerfectRunner({
								target: _p.options.a,
								role: 'a',
								include: _p.options.include,
								exclude: _p.options.exclude,
								mediator: _p.mediator
							});
						}
					}

					function createRunnerB() {
						if (_p.b === undefined) {
							_p.b = new PerfectRunner({
								target: _p.options.b,
								role: 'b',
								include: _p.options.include,
								exclude: _p.options.exclude,
								mediator: _p.mediator
							});
						}
					}

					createMediator();
					createUI();
					subscribeCallbacks();
					createRunnerA();
					createRunnerB();
				},

				add: function(name, fn, teardown) {
					_p.f.init();

					var suite = _p.a.add(name, fn, teardown);
					_p.b.add(name, fn, teardown);

					if (suite !== undefined) {
						var bench = suite[suite.length-1];
						_p.ui && _p.ui.add(bench);
					}

					return this;
				},

				run: function(options) {
					_p.mediator.publish("log", "Perfect", "Running a...");
					_p.a.run();
				},

				onStart: function(role) {
					_p.mediator.publish("log", "Perfect", "Started " + role);
				},

				onCycle: function(role, e) {
					var targetBenches = role == 'a' ? _p.benchesA : _p.benchesB;
					targetBenches[e.target.name] = e.target;

					if (role == 'b') {
						var targetA = _p.benchesA[e.target.name];
						var targetB = e.target;
						var diff = targetB.compare(targetA);
						var change = (targetB.hz - targetA.hz) / targetA.hz * 100;

						_p.mediator.publish(
							"log",
							"Perfect",
							"The percentage change is: " + change.toFixed(2) + "%");

						if (diff < 0) {
							_p.mediator.publish(
								"log",
								"Perfect",
								"'b' can be considered faster than 'a'");
						} else if (diff === 0) {
							_p.mediator.publish(
								"log",
								"Perfect",
								"There is no statistically significative performance " +
								"difference between 'a' and 'b'");
						} else {
							_p.mediator.publish(
								"log",
								"Perfect",
								"'a' can be considered faster than 'b'");
						}
					}

					_p.mediator.publish("log", "Perfect", "Cycled " + role);
				},

				onComplete: function(role) {
					_p.mediator.publish("log", "Perfect", "Completed " + role);

					if (role == 'a') {
						_p.mediator.publish("log", "Perfect", "Running b...");
						_p.b.run();
					} else if (role == 'b') {
						_p.mediator.publish("log", "Perfect", "Completed all");
					}
				}
			}
		};

		_.extend(_p.options, options);

		return {
			add: _p.f.add,
			run: _p.f.run
		};
	});

	window.Perfect = perfect;
}(this, _, Mediator, PerfectRunner, PerfectUI));
