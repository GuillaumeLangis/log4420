$(document).ready(function()  {	
	window.sessionStorage['current.domain'] = $('#test-domain').val();
	window.sessionStorage['current.nbQuestions'] = $('#test-nbQuestions').val();
	
	updateMaxNbQuestions();

	// displayStatistics(1);
	// displayDetails();

	$('#test-domain').on('change', function() {
		if($(this).val() == 'CSS' || 'JS' || 'HTML') {
			window.sessionStorage['current.domain'] = $(this).val();

			updateMaxNbQuestions();

		} else {
	  		alert('Valeur de domaine invalide.');
		}	
	});
	$('#test-nbQuestions').on('change', function() {
		var val = $(this).val();
		var max = $(this).attr('max')
		if (val > max) {
			$(this).val(Math.min(val, max));
		}

		window.sessionStorage['current.nbQuestions'] = $(this).val();
	});
	$('#test-nbQuestions').on('keyup', function() {
		var val = $(this).val();
		var max = $(this).attr('max')
		if (val > max) {
			$(this).val(Math.min(val, max));
		}

		window.sessionStorage['current.nbQuestions'] = $(this).val();
	});

	$('#stats-button').on('click', function() {
		// initResults();
		// displayStatistics(1);
		// displayDetails();
	});
});

function updateMaxNbQuestions() {
	$.get(
		'/api/nbquestions?domain=' + window.sessionStorage['current.domain'],
		function(response) {
			$('#test-nbQuestions').attr('max', response.count);
		});
}