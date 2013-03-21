;(function(window, undefined) {
	'use strict';

	function fib(n){
		return n < 2 ? n : fib(n-1) + fib(n-2);
	}

	window.fib = fib;
}(this));
