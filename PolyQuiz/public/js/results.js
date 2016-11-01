$(document).ready(function() {
	var correct = window.sessionStorage['current.correctAnswers'];
	var total = window.sessionStorage['current.nbQuestions'];
	var domaine = window.sessionStorage['current.domain'];

	var percentage = correct / total;

	var customMessage;
	if(percentage < .25) {
		customMessage = "Vous avez obtenu en dessous de 25%, get it together!";
	} else if (percentage < .5) {
		customMessage = "Vous avez obtenu entre 25% et 50%, vous coulez, si près mais si loin!";
	} else if (percentage < .75) {
		customMessage = "Vous avez obtenu entre 50% et 75%, vous avez passez, yé!";
	} else {
		customMessage = "Vous avez obtenu en dessus de 75%, you smart!";
	}

	$('#result').text('Vous avez obtenu ' + correct + ' bonne réponse(s) sur un total de ' + total + ' question(s). ' + customMessage);

	saveResults(correct, total, domaine);
	displayStatistics(0);
});