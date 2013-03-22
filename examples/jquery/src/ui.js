;(function(window, $, undefined) {
	$(function() {
		$('#run').click(function() {
			QUnit.runPerfect();
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
			$('#status #comparing #a').text(QUnit.getPerfect().options.a);
			$('#status #comparing #b').text(QUnit.getPerfect().options.b);

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
					'<td class="diff"><i class="icon-time"></i></td>' +
				'</tr>');

			$template.attr('id', event.target.id);
			$template.find('.number').text(event.target.id);
			$template.find('.name').text(event.target.name);
			$template.find('.hz_a')
				.text(humanize.numberFormat(event.target.hz / 1000.0))
				.attr('data-value', event.target.hz);

			$('#tests tbody').append($template);
			$('#csv').append(
				event.target.id + ',"' +
				event.target.name + '","' +
				event.target.hz + '"\n');
		},

		onCycleB: function(event, suite) {
			console.log("window.ui.onCycleB");

			var $row = $('#tests').find('tr#' + event.target.id),
			    hz_a = parseFloat($row.find('td.hz_a').attr('data-value')),
				hz_b = event.target.hz,
				diff = humanize.numberFormat((hz_a - hz_b) / hz_a);

			$row.find('td.hz_b')
				.text(humanize.numberFormat(hz_b / 1000.0))
				.attr('data-value', hz_b);

			$row.find('td.diff').text(diff + '%');
			if (diff > 0) {
				$row.addClass('success');
			} else if (diff < 0) {
				$row.addClass('error');
			}
		},

		onComplete: function(suite) {
			console.log("window.ui.onComplete");
			$('#status').remove();
			$('#report').text("All tests completed.");
			$('#report').addClass('alert alert-success');
			$('#toggleCSV').show();
		}
	};
}(this, jQuery));
