;(function (window, PerfectRunner, undefined) {
	module("perfect-runner");

	function fn() {
		for(i=0; i<100; i++);
	}

	asyncTest("should get all callbacks called", function () {
		expect(3);

		var runner = new PerfectRunner({
			target: 'lib/a.js',
			callbacks: {
				start: function() {
					ok(true, "start callback called");
				},
				cycle: function() {
					ok(true, "cycle callback called");
				},
				complete: function() {
					ok(true, "complete callback called");
					start();
				}
			}
		});

		runner.add("test", fn);
		runner.run();
	});

	asyncTest("include option", function() {
		expect(1);

		var runner = new PerfectRunner({
			target: 'lib/a.js',
			include: ['test1'],
			callbacks: {
				cycle: function(e) {
					equal(e.target.name, 'test1', "test1 was executed");
					start();
				}
			}
		});

		runner.add('test2', fn);
		runner.add('test1', fn);
		runner.run();
	});

	asyncTest("exclude option", function() {
		expect(1);

		var runner = new PerfectRunner({
			target: 'lib/a.js',
			exclude: ['test2'],
			callbacks: {
				cycle: function(e) {
					equal(e.target.name, 'test1');
					start();
				}
			}
		});

		runner.add('test2', fn);
		runner.add('test1', fn);
		runner.run();
	});

	asyncTest("teardown", function() {
		expect(1);

		var runner = new PerfectRunner({
			target: 'lib/a.js'
		});

		runner.add('test', fn, function() {
			ok(true, "teardown function called");
			start();
		});

		runner.run();
	});
}(this, PerfectRunner));
