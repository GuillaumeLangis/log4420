$(document).ready(function() {	
	// drag and drop
	var answers = $('#answer .possibleAnswer');
	[].forEach.call(answers, function(answer) {
		answer.addEventListener('dragstart', handleAnswerDragStart, false);
		answer.addEventListener('dragend', handleAnswerDragEnd, false);
	});

	var answerBox = document.querySelector('#answerbox');
	answerBox.addEventListener('drop', handleAnswerBoxDrop, false);
	answerBox.addEventListener('dragenter', handleAnswerBoxDragEnter, false);
	answerBox.addEventListener('dragover', handleAnswerBoxDragOver, false);
	answerBox.addEventListener('dragleave', handleAnswerBoxDragLeave, false);

	var correctQuestion = 0;
	var questionNumber = 0;
	var answered = false;

	getNewQuestion();

	$('#next.quiz-navig-btn').on('click', function() {
		if(answered) {
			questionNumber++
			getNewQuestion();
		}
	});

	function getNewQuestion() {
		displayStatistics(0);
		
		resetQuestionStyles();

	 	$('#questionProgress').text(correctQuestion + '/' + questionNumber);

	 	var questionTitleNumber = questionNumber + 1;
	 	$('#questionTitle').text('Question ' + questionTitleNumber);

	    $.ajax({
			url: "api/quicktest",
			type: "get", 
			success: function(response) {
				$('#domain').text(response.domain);
				$('#askedQuestion').text(response.question);
				$('#answer1').text(response.answers[0]);
				$('#answer2').text(response.answers[1]);
				$('#answer3').text(response.answers[2]);
				setCorrectAnswer(response.correctanswerindex);
			},
			error: function(error) {
				alert("AJAX request failed.");
			}
		});
	}

	function saveResult(success) {
		if(window.localStorage['stats.quicktests.total'] == null) {
			window.localStorage['stats.quicktests.total'] = 0;
			window.localStorage['stats.quicktests.correct'] = 0;
		}

		var total = window.localStorage['stats.quicktests.total'];
		window.localStorage['stats.quicktests.total'] = ++total;

		if(success) {
			var correct = window.localStorage['stats.quicktests.correct'];
			window.localStorage['stats.quicktests.correct'] = ++correct;
		}
	}

	function handleAnswerBoxDrop(e) {
		$(this).css('opacity', '1');

		if (e.stopPropagation) {
			e.stopPropagation(); // Stops some browsers from redirecting.
		}

		var answers = $('#answer .possibleAnswer');
		[].forEach.call(answers, function(answer) {
			answer.removeAttribute('draggable');
			answer.style.cursor = 'default';
		});

		$(this).text(e.dataTransfer.getData('text'));
		if(e.dataTransfer.getData('index') == correctAnswer) {
			$(this).css('border-color', 'green');
			correctQuestion++;
			saveResult(1);
		} else {
			$(this).css('border-color', 'red');
			saveResult(0);
		}
		answered = true;
	}
});