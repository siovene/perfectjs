;(function(window, Perfect, undefined) {
	var perfect = new Perfect({
		name: 'Simple Performance Tests',
		description: 'Compares a recursive and a fast iterative Fibonacci ' +
		             'sequence generators.',
		a: 'lib/simple-0.1.js',
		b: 'lib/simple-0.2.js',
		enable_ui: true,
		include: ['fib_unchanged(8)']
    });

	perfect
	.add( "fib_unchanged(8)", function() {
		fib_unchanged(8);
	})
	.add( "fib(4)", function() {
		fib(4);
	})
	.add( "fib(8)", function() {
		fib(8);
	})
	.add( "fib(16)", function() {
		fib(16);
	})
	.add( "fib(32)", function() {
		fib(32);
	});

	perfect.run();
}(this, Perfect));
