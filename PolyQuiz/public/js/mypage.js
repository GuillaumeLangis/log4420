$(document).ready(function()  {	
	window.sessionStorage['current.domain'] = $('#test-domain').val();
	window.sessionStorage['current.nbQuestions'] = $('#test-nbQuestions').val();

	displayStatistics(1);
	displayDetails();

	$('#test-domain').on('change', function() {
		if($(this).val() == 'CSS' || 'JS' || 'HTML') {
			window.sessionStorage['current.domain'] = $(this).val();
		} else {
	  		alert('Valeur de domaine invalide.');
		}	
	});
	$('#test-nbQuestions').on('change', function() {
		if($(this).val() == '1' || '2' || '3' || '4') {
			window.sessionStorage['current.nbQuestions'] = $(this).val();
		} else {
	  		alert('Valeur de nombre de questions invalide.');
		}
	});

	$('#stats-button').on('click', function() {
		initResults();
		displayStatistics(1);
		displayDetails();
	});
});