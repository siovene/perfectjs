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

;(function(window, _, Mediator, PerfectRunner, undefined) {
	var perfect = (function(options) {
		var _p = {
			options: {},

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
					if (_p.mediator === undefined) {
						_p.mediator = new Mediator();
						_p.mediator.subscribe("log", _p.f.log);
						_p.mediator.subscribe("start", _p.f.onStart);
						_p.mediator.subscribe("cycle", _p.f.onCycle);
						_p.mediator.subscribe("complete", _p.f.onComplete);
					}

					if (_p.a === undefined) {
						_p.a = new PerfectRunner({
							target: _p.options.a,
							role: 'a',
							mediator: _p.mediator
						});
					}

					if (_p.b === undefined) {
						_p.b = new PerfectRunner({
							target: _p.options.b,
							role: 'b',
							mediator: _p.mediator
						});
					}
				},

				add: function(name, fn, teardown) {
					_p.f.init();
					_p.a.add(name, fn, teardown);
					_p.b.add(name, fn, teardown);
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
}(this, _, Mediator, PerfectRunner));
