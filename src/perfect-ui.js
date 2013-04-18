/* jshint newcap: false, -W061 */

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

;(function(window, doc, _, undefined) {
	var perfectUI = (function(options) {
		'use strict';

		/**
		 * Set an element's innerHTML property.
		 * @private
		 * @param {Element|String} element The element or id of the element.
		 * @param {String} html The HTML to set.
		 * @returns {Element} The element.
		 */
		function setHTML(element, html) {
			element.innerHTML = html == null ? '' : html;
			return element;
		}

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
			options: {
				mediator: {
					publish: function() {}
				}
			},

			benchesA: {},
			benchesB: {},

			f: {
				createUI: function() {
					var $container = $('#perfect');

					if ($container.firstChild !== null)
						return;

					var $table = doc.createElement('table');
					$table.setAttribute('id', 'pt');
					$table.className = 'table table-condensed table-striped';
					setHTML(
						$table,
						'<thead>                   ' +
						'	<tr>                   ' +
						'		<th></th>          ' +
						'		<th></th>          ' +
						'		<th>A</th>         ' +
						'		<th>B</th>         ' +
						'		<th></th>          ' +
						'		<th></th>          ' +
						'	</tr>                  ' +
						'	<tr>                   ' +
						'		<th>#</th>         ' +
						'		<th>Test name</th> ' +
						'		<th>Ops/s</th>     ' +
						'		<th>Ops/s</th>     ' +
						'		<th>Change</th>    ' +
						'		<th>Best</th>      ' +
						'	</tr>                  ' +
						'</thead>                  ' +
						'<tbody id="pt-body">      ' +
						'</tbody>                  ');

					if (_p.options.name !== undefined) {
						var $title = doc.createElement('h1');
						setHTML($title, _p.options.name);
						$container.appendChild($title);
					}

					if (_p.options.description !== undefined) {
						var $desc = doc.createElement('p');
						setHTML($desc, _p.options.description);
						$container.appendChild($desc);
					}

					$container.appendChild($table);
				},

				start: function(role) {
				},

				cycle: function(role, e) {
					var id = e.target.id % 2 ? e.target.id : e.target.id - 1;
					var $row = $('#pt-row-' + id);
					var $col = $('.' + role, $row)[0];
					var $hz = $('.hz', $col)[0];
					var $err = $('.err', $col)[0];
					var $change = $('.change', $row)[0];

					$hz.setAttribute('data-value', e.target.hz);
					setHTML($hz, (e.target.hz / 1000.0).toFixed(2) + 'K');

					$err.setAttribute('data-value', e.target.stats.rme);
					setHTML($err, '&plusmn; ' + e.target.stats.rme.toFixed(2) + '%');

					var targetBenches = role == 'a' ? _p.benchesA : _p.benchesB;
					targetBenches[e.target.name] = e.target;

					if (role == 'b') {
						var $a_col = $('.a', $row)[0];
						var a_hz = parseFloat($('.hz', $a_col)[0].getAttribute('data-value'));
						var targetA = _p.benchesA[e.target.name];
						var targetB = e.target;
						var change = Perfect.change(targetA, targetB);
						var best = Perfect.compare(targetA, targetB);
						var $best = $('.best', $row)[0];


						setHTML($change, change.toFixed(2) + '%');

						if (best < 0) {
							$best.innerText = 'A';
							$row.className = 'error';
						} else if (best === 0) {
							$best.innerText = '=';
						} else {
							$best.innerText = 'B';
							$row.className = 'success';
						}
					}
				},

				complete: function(role) {
				},

				add: function(bench) {
					_p.f.createUI();

					var template = t(
						'	<td class="number">#{this.number}</td>  ' +
						'	<td class="name">#{this.name}</td>      ' +
						'	<td class="a">                          ' +
						'		<span class="hz"                    ' +
						'		      data-value="#{this.hz_a}">    ' +
						'			#{this.hz_a_print}              ' +
						'		</span>                             ' +
						'		<span class="err"                   ' +
						'		      data-value="#{this.err_a}">   ' +
						'			#{this.err_a_print}             ' +
						'		</span>                             ' +
						'	</td>                                   ' +
						'	<td class="b">                          ' +
						'		<span class="hz"                    ' +
						'		      data-value="#{this.hz_b}">    ' +
						'			#{this.hz_b_print}              ' +
						'		</span>                             ' +
						'		<span class="err"                   ' +
						'		      data-value="#{this.err_b}">   ' +
						'			#{this.err_b_print}             ' +
						'		</span>                             ' +
						'	</td>                                   ' +
						'	<td class="change">#{this.change}</td>  ' +
						'	<td class="best">#{this.best}</td>      ');

					var html = template({
						number: bench.id,
						name: bench.name,
						hz_a: 0,
						hz_a_print: 'Pending',
						err_a: 0,
						err_a_print: '',
						hz_b: 0,
						hz_b_print: 'Pending',
						err_b: 0,
						err_b_print: '',
						change: 'Pending',
						best: 'Pending'
					});

					var $row = doc.createElement('tr');
					$row.setAttribute('id', 'pt-row-' + bench.id);
					setHTML($row, html);

					var $pt_body = $("#pt-body");
					$pt_body.appendChild($row);
				}
			}
		};

		_.extend(_p.options, options);
		return {
			start: _p.f.start,
			cycle: _p.f.cycle,
			complete: _p.f.complete,
			add: _p.f.add
		};
	});

	window.PerfectUI = perfectUI;
}(this, document, _));
