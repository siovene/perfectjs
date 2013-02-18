$(function() {
	jQuerySuiteGlobals = {
		suite: new Benchmark.Suite(),
		perfect: new Perfect()
	};

	Benchmark.options.maxTime = 5;

	var set_of_p = $('<p>1</p> <p>2</p> <p>3</p>');

	jQuerySuiteGlobals.suite
	.add( "core: $() empty div", function() {
		var html = '<div/>';
		var obj = $(html);
		obj.size();
	})
	.add( "core: $() div with text", function() {
		var html = '<div>test</div>';
		var obj = $(html);
		obj.size();
	})
	.add( "core: size()", function() {
		set_of_p.size();
	})
	.add( "core: toArray()", function() {
		set_of_p.toArray();
	})
	.add( "core: get()", function() {
		set_of_p.get(1);
	})
	.add( "core: pushStack()", function() {
		var html = '<div/>';
		jQuery([]).pushStack(html)
			.remove()
		.end();
	})
	.add( "core: each()", function() {
		set_of_p.each(function() {});
	})
	.add( "core: ready()", function() {
		$.ready(function() {});
	})
	.add( "core: slice()", function() {
		set_of_p.slice(2);
	})
	.add( "core: first()", function() {
		set_of_p.first();
	})
	.add( "core: last()", function() {
		set_of_p.last();
	})
	.add( "core: eq()", function() {
		set_of_p.eq(1);
	})
	.add( "core: map()", function() {
		set_of_p.map(function() {});
	})
	.add( "core: end()", function() {
		set_of_p.end();
	});

	jQuerySuiteGlobals.perfect.setOptions({
		name: 'jQuery Performance Regression Tests',
		a: 'lib/jquery-1.8.3.min.js',
		b: 'lib/jquery-1.9.1.min.js',
		suite: jQuerySuiteGlobals.suite,

		start: ui.onStart,
		cycle: ui.onCycle,
		complete: ui.onComplete,

		cycle_a: ui.onCycleA,
		cycle_b: ui.onCycleB,

		lazyload_a: false
	});
});
