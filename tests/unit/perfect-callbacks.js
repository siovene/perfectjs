$(function () {
	module("perfect-callbacks")

	asyncTest("should get all callbacks called", 10, function () {
		var suite = new Benchmark.Suite(),
		    perfect = new Perfect();

		suite.add("test", function() {});

		perfect.setOptions({
			a: 'lib/a.js',
			b: 'lib/b.js',
			enable_ui: false,
			suite: suite,
			start: function() {
				equal(0, 0, "start callback called");
			},
			cycle: function() {
				equal(0, 0, "cycle callback called");
			},
			complete: function() {
				equal(0, 0, "complete callback called");
				start();
			},

			start_a: function() {
				equal(0, 0, "start_a callback called");
			},
			cycle_a: function() {
				equal(0, 0, "cycle_a callback called");
			},
			complete_a: function() {
				equal(0, 0, "complete_a callback called");
			},

			start_b: function() {
				equal(0, 0, "start_b callback called");
			},
			cycle_b: function() {
				equal(0, 0, "cycle_b callback called");
			},
			complete_b: function() {
				equal(0, 0, "complete_b callback called");
			}
		});

		perfect.run();
	})
})
