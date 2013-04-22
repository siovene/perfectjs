;(function(window, undefined) {
	'use strict';

	function fib(n){
		return n < 2 ? n : fib(n-1) + fib(n-2);
	}

	function fib_unchanged(n) {
		return n < 2 ? n : fib_unchanged(n-1) + fib_unchanged(n-2);
	}

	window.fib = fib;
	window.fib_unchanged = fib_unchanged;
}(this));
