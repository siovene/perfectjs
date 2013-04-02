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
					'<td class="hz_a"><abbr></abbr></td>' +
                    '<td class="hz_b"><i class="icon-time"></i></td>' +
					'<td class="change"><i class="icon-time"></i></td>' +
				'</tr>');

			$template.attr('id', event.target.id);
			$template.find('.number').text(event.target.id);
			$template.find('.name').text(event.target.name);
			$template.find('.hz_a abbr')
				.text(humanize.numberFormat(event.target.hz / 1000.0))
				.attr('title', event.target.hz);

			if (event.target.hz === 0) {
				$template.addClass('warning');
			}

			$('#tests tbody').append($template);
			$('#csv').append(
				event.target.id + ',"' +
				event.target.name + '","' +
				event.target.hz + '"\n');
		},

		onCycleB: function(event, suite) {
			console.log("window.ui.onCycleB");

			var $row = $('#tests').find('tr#' + event.target.id),
				$hz_b_abbr = $('<abbr/>'),
				$percent_abbr = $('<abbr/>'),
			    hz_a = parseFloat($row.find('td.hz_a abbr').attr('title')),
				hz_b = event.target.hz,
				change = humanize.numberFormat((hz_b - hz_a) / hz_a * 100);

			$hz_b_abbr
				.text(humanize.numberFormat(hz_b / 1000.0) + " (" + event.target.count + ")")
				.attr('title', hz_b);

			$row.find('td.hz_b').html($hz_b_abbr);

			$percent_abbr
				.text(change + '%')
				.attr('title', change);
			$row.find('td.change').html($percent_abbr);
			if (change > QUnit.getPerfect().options.changeThreshold) {
				$row.addClass('success');
			} else if (change < -QUnit.getPerfect().options.changeThreshold) {
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
