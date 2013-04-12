;(function (window, Perfect, doc, undefined) {
	module("perfect-ui");

	function fn() {
		for(i=0; i<100; i++);
	}

	asyncTest("table is created", function () {
		var perfect = new Perfect({
			a: 'lib/a.js',
			b: 'lib/b.js',
			enable_ui: true,
			callbacks: {
				start: function() {
					var table = doc.getElementById("pt");
					ok(table !== null, "table is created");
					start();
				}
			}
		});

		perfect.add("test", fn);
		perfect.run();
	});
}(this, Perfect, document));
