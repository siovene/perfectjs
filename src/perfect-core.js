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

				setOptions: function(options) {
					_.extend(_p.options, options);
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
						var change = perfect.change(targetA, targetB);
						var best = perfect.compare(targetA, targetB);

						_p.mediator.publish(
							"log",
							"Perfect",
							"The percentage change is: " + change.toFixed(2) + "%");

						if (best < 0) {
							_p.mediator.publish(
								"log",
								"Perfect",
								"'a' can be considered faster than 'b'");
						} else if (best === 0) {
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

		_p.f.setOptions(options);

		return {
			add: _p.f.add,
			run: _p.f.run
		};
	});


	perfect.change = function(a, b) {
		return (b.hz - a.hz) / a.hz * 100;
	};

	perfect.compare = function(a, b) {
		return b.compare(a);
	};

	window.Perfect = perfect;
}(this, _, Mediator, PerfectRunner, PerfectUI));
