;(function(window, undefined) {
	$(function() {
		$('#run').click(function() {
			jQuerySuiteGlobals.perfect.run();
		});

		$('#toggleCSV button').click(function() {
			$('table#tests').toggle();
			$('textarea#csv').toggle();

			if ( $('#csv').is(':visible') ) {
				$('#csv').height($('#csv')[0].scrollHeight);
			}
		});
	});

	window.ui = {
		onStart: function(event, suite) {
			$('#status #progress #total').text(suite.length);
			$('#opsPerSec').text(Benchmark.options.maxTime);
			$('#estimatedTime').text(suite.length * Benchmark.options.maxTime);

			$('#progress').removeClass('hidden');
			$('#starting').removeClass('hidden');
			$('#status').removeClass('hidden');

			$('#run').remove();
		},

		onCycle: function(event, suite) {
			var $template = $(
				'<tr>' +
					'<td class="number"></td>' +
					'<td class="name"></td>' +
					'<td class="hz"></td>' +
				'</tr>');

			if ( event.target.id == 1 ) {
				$('#starting').hide();
				$('#tests').show();
			}

			$('#estimatedTime').text(
				(suite.length - event.target.id) *
				Benchmark.options.maxTime);

			$template.find('.number').text(event.target.id);
			$template.find('.name').text(event.target.name);
			$template.find('.hz').text(humanize.numberFormat(event.target.hz / 1000.0));
			$('#tests tbody').append($template);
			$('#csv').append(
				event.target.id + ',"' +
				event.target.name + '","' +
				event.target.hz + '"\n');

			$('#status #progress #current').text(event.target.id + 1);
			$('#progress .bar').width((event.target.id / suite.length * 100) + '%');
		},

		onComplete: function(suite) {
			$('#status').remove();
			$('#report').text("All tests completed.");
			$('#report').addClass('alert alert-success');
			$('#toggleCSV').show();
		}
	};
}(this));
