$(document).ready(function() {
	var stats;
	var exam;

	$.ajax({
		url:'/api/stats',
		type:'get',
		success:function(response) {
			stats = response;
			exam = stats.exams[stats.currentExam];

			var correct = exam.questionsSuccess;
			var total = exam.questionsTotal;
			var domaine = exam.domain;

			var percentage = correct / total;

			var customMessage;
			if(percentage < .25) {
				customMessage = "Vous avez obtenu en dessous de 25%, get it together!";
			} else if (percentage < .5) {
				customMessage = "Vous avez obtenu entre 25% et 50%, vous coulez, si près mais si loin!";
			} else if (percentage < .75) {
				customMessage = "Vous avez obtenu entre 50% et 75%, vous avez passez, yé!";
			} else {
				customMessage = "Vous avez obtenu au dessus de 75%, you smart!";
			}

			$('#result').text('Vous avez obtenu ' + correct + ' bonne réponse(s) sur un total de ' + total + ' question(s). ' + customMessage);

			// saveResults(correct, total, domaine);
			$.ajax({
				url:'/api/finish',
				type:'post',
				data: {evaltype: 'exam'},
				success: function(resp) {
					// console.log(resp);
					displayStatistics(0);
				},
				error : function(resp) {
					// console.log(resp);
					displayStatistics(0);
				}
			});
		},
		error:function(response) {

		}
	});
	
	
});