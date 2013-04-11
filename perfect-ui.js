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
	var perfectUI = (function() {
		'use strict';

		/*
		 * Templating
		 * Copyright (C) 2011 Jed Schmidt <http://jed.is> - WTFPL
		 * More: https://gist.github.com/964762
		 */
		var t = function(a, b) {
			return function(c, d) {
				return a.replace(/#{([^}]*)}/g, function(a, e) {
					return Function("x", "with(x)return " + e).call(c, d || b || {});
				})
			}
		};

		/*
		 * Create DOM element
		 * Copyright (C) 2011 Jed Schmidt <http://jed.is> - WTFPL
		 * More: https://gist.github.com/966233
		 */
		var m = function(a, b, c) {
			b = document;                   // get the document,
			c = b.createElement("p");       // create a container element,
			c.innerHTML = a;                // write the HTML to it, and
			a = b.createDocumentFragment(); // create a fragment.

			while(b = c.firstChild) a.appendChild(b);
			return a;
		};

		/*
		 * DOM selector
		 * Copyright (C) 2011 Jed Schmidt <http://jed.is> - WTFPL
		 * More: https://gist.github.com/991057
		 */
		var $ = function(
		  a,                         // take a simple selector like "name", "#name", or ".name", and
		  b                          // an optional context, and
		){
		  a = a.match(/^(\W)?(.*)/); // split the selector into name and symbol.
		  return(                    // return an element or list, from within the scope of
			b                        // the passed context
			|| document              // or document,
		  )[
			"getElement" + (         // obtained by the appropriate method calculated by
			  a[1]
				? a[1] == "#"
				  ? "ById"           // the node by ID,
				  : "sByClassName"   // the nodes by class name, or
				: "sByTagName"       // the nodes by tag name,
			)
		  ](
			a[2]                     // called with the name.
		  )
		};

		var _p = {
			f: {
				start: function(role) {
					if (role == 'a') {
						var $container = $("#perfect");
						var $table = m(
							'<table id="perfect-table">'        +
							'	<thead>'                        +
							'		<tr>'                       +
							'			<th></th>'              +
							'			<th></th>'              +
							'			<th colspan="3">A</th>' +
							'			<th colspan="3">B</th>' +
							'			<th></th>'              +
							'		</tr>'                      +
							'		<tr>'                       +
							'			<th>#</th>'             +
							'			<th>Test name</th>'     +
							'			<th>Ops/s</th>'         +
							'			<th>Error</th>'         +
							'			<th>Count</th>'         +
							'			<th>Ops/s</th>'         +
							'			<th>Error</th>'         +
							'			<th>Count</th>'         +
							'			<th>Diff</th>'          +
							'		</tr>'                      +
							'	</thead>'                       +
							'	<tbody>'                        +
							'	</tbody>'                       +
							'</table>');

						$container.appendChild($table);
					}
				},

				cycle: function(role) {
				},

				complete: function(role) {
				}
			}
		};

		return {
			start: _p.f.start,
			cycle: _p.f.cycle,
			complete: _p.f.complete
		};
	});

	window.PerfectUI = perfectUI;
}(this));
