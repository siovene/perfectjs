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

/*global define:false*/
/*global module:false*/
/*global Benchmark:false*/

;(function(window, Benchmark, Perfect, undefined) {
	'use strict';

	function extend(a, b) {
		for ( var prop in b ) {
			if ( b[prop] === undefined ) {
				delete a[prop];
			} else {
				a[prop] = b[prop];
			}
		}

		return a;
	}

	/* ---------------------------------------------------------------------- */
	/* QUnit compatibility. */

	var QUnit = function() {
		var _priv = {
			perfect: null
		};

		return {
			module: function(name, env) {},

			test: function(name, expected, fn) {
				if (arguments.length == 2) {
					fn = expected;
				}

				_priv.perfect.options.suite.add(name, fn);
			},

			asyncTest: function(name, expected, fn) {
				return this.test(name, expected, fn);
			},

			initPerfect: function() {
			},

			runPerfect: function(options) {
				if (_priv.perfect === null) {
					_priv.perfect = new Perfect();
					_priv.perfect.options.suite = new Benchmark.Suite();
				}

				_priv.perfect.setOptions(options);

				return _priv.perfect.run();
			}
		};
	}();

	/* ---------------------------------------------------------------------- */
	/* Expose Perfect. */

	// some AMD build optimizers, like r.js, check for specific condition
    // patterns like the following:
	if (typeof define == 'function' && typeof define.amd == 'object' &&
	    define.amd) {
		// define as an anonymous module so, through path mapping, it can be
        // aliased
		define('perfect-qunit', ['benchmark', 'perfect'], function() {
			return QUnit;
		});
	}
	// check for `exports` after `define` in case a build optimizer adds an
	// `exports` object
	else if (window.freeExports) {
		// in Node.js or RingoJS v0.8.0+
		if (typeof module == 'object' && module &&
		    module.exports == this.freeExports) {
			(module.exports = QUnit).QUnit = QUnit;
		}
		// in Narwhal or RingoJS v0.7.0-
		else {
			window.freeExports.QUnit = QUnit;
		}
	}
	// in a browser or Rhino
	else {
		// use square bracket notation so Closure Compiler won't munge
		// `QUnit`
		// http://code.google.com/closure/compiler/docs/api-tutorial3.html#export

		extend(window, QUnit);
		window['QUnit'] = QUnit;
	}

}(this, Benchmark, Perfect));
