;(function (window, Perfect, undefined) {
	module("perfect-core");

	function fn() {
		for(i=0; i<100; i++);
	}

	asyncTest("should get all callbacks called", function () {
		expect(14); // 'cycle' gets to run twice, hence 12+2

		var perfect = new Perfect({
			a: 'lib/a.js',
			b: 'lib/b.js',
			callbacks: {
				start: function() {
					ok(true, "start callback called");
				},
				cycle: function(e) {
					ok(true, "cycle callback called");
					ok(e !== undefined, "event is available");
				},
				complete: function() {
					ok(true, "complete callback called");
					start();
				},

				start_a: function() {
					ok(true, "start_a callback called");
				},
				cycle_a: function(e) {
					ok(true, "cycle_a callback called");
					ok(e !== undefined, "event is available");
				},
				complete_a: function() {
					ok(true, "complete_a callback called");
				},

				start_b: function() {
					ok(true, "start_b callback called");
				},
				cycle_b: function(e) {
					ok(true, "cycle_b callback called");
					ok(e !== undefined, "event is available");
				},
				complete_b: function() {
					ok(true, "complete_b callback called");
				}
			}
		});

		perfect.add("test", fn);
		perfect.run();
	});

	asyncTest("include option", function() {
		expect(1);

		var perfect = new Perfect({
			a: 'lib/a.js',
			b: 'lib/b.js',
			include: ['test1'],
			callbacks: {
				cycle_a: function(e) {
					equal(e.target.name, 'test1', "test1 was executed");
					start();
				}
			}
		});

		perfect.add('test2', fn);
		perfect.add('test1', fn);
		perfect.run();
	});

	asyncTest("exclude option", function() {
		expect(1);

		var perfect = new Perfect({
			a: 'lib/a.js',
			b: 'lib/b.js',
			exclude: ['test2'],
			callbacks: {
				cycle_a: function(e) {
					equal(e.target.name, 'test1', "test1 was executed");
					start();
				}
			}
		});

		perfect.add('test2', fn);
		perfect.add('test1', fn);
		perfect.run();
	});

	asyncTest("teardown", function() {
		expect(2); // the teardown function is run once for a and once for b

		var perfect = new Perfect({
			a: 'lib/a.js',
			b: 'lib/b.js'
		});

		perfect.add( 'test', fn, function() {
			ok(true, "the teardown function was run");
			start();
		});

		stop();
		perfect.run();
	});
}(this, Perfect));
