$(function() {
	var suite = new Benchmark.Suite(),
	    perfect = new Perfect();

	suite.add( "fib(4)", function() {
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

	perfect.setOptions({
		name: 'Simple Performance Regression Tests',
		a: 'lib/simple-0.1.js',
		b: 'lib/simple-0.2.js',
		suite: suite
	});

	perfect.run();
});
