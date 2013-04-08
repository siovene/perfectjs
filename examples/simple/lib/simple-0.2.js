;(function(window, undefined) {
	'use strict';

	function fib(n) {
		var i;
		var fibs = new Array();

		fibs.push(0);
		fibs.push(1);

		for(i=0; i<n; i++) {
			fibs.push(fibs[0] + fibs[1]);
			fibs.shift();
		}

		return fibs[0];
	}

	function fib_unchanged(n){
		return n < 2 ? n : fib(n-1) + fib(n-2);
	}

	window.fib = fib;
	window.fib_unchanged = fib_unchanged;
}(this));
