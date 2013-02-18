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
			console.log("window.ui.onStart");
			$('#status #progress #total').text(suite.length);
			$('#opsPerSec').text(Benchmark.options.maxTime);
			$('#estimatedTime').text(suite.length * Benchmark.options.maxTime);

			$('#progress').removeClass('hidden');
			$('#starting').removeClass('hidden');
			$('#status').removeClass('hidden');

			$('#run').remove();
		},

		onCycle: function(event, suite) {
			console.log("window.ui.onCycle");
			if ( event.target.id == 1 ) {
				$('#starting').hide();
				$('#tests').show();
			}

			$('#estimatedTime').text(
				(suite.length - event.target.id) *
				Benchmark.options.maxTime);

			$('#status #progress #current').text(event.target.id + 1);
			$('#progress .bar').width((event.target.id / suite.length * 100) + '%');
		},

		onCycleA: function(event, suite) {
			console.log("window.ui.onCycleA");
			var $template = $(
				'<tr>' +
					'<td class="number"></td>' +
					'<td class="name"></td>' +
					'<td class="hz_a"></td>' +
                    '<td class="hz_b"><i class="icon-time"></i></td>' +
				'</tr>');

			$template.attr('id', event.target.id);
			$template.find('.number').text(event.target.id);
			$template.find('.name').text(event.target.name);
			$template.find('.hz_a').text(humanize.numberFormat(event.target.hz / 1000.0));
			$('#tests tbody').append($template);
			$('#csv').append(
				event.target.id + ',"' +
				event.target.name + '","' +
				event.target.hz + '"\n');
		},

		onCycleB: function(event, suite) {
			console.log("window.ui.onCycleB");
			$('#tests').find('tr#' + event.target.id + ' td.hz_b').text(
				humanize.numberFormat(event.target.hz / 1000.0));
		},

		onComplete: function(suite) {
			console.log("window.ui.onComplete");
			$('#status').remove();
			$('#report').text("All tests completed.");
			$('#report').addClass('alert alert-success');
			$('#toggleCSV').show();
		}
	};
}(this));
