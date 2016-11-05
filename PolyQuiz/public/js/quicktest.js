$(document).ready(function() {	

	var qt;
	var questions;

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

	$.ajax({
		url: "/api/start",
		type: "post", 
		data: {
			evaltype: 'exam',
			domain: domaine, 
			total: nbQuestion
		},
		success: function(response) {
			qt = response.quicktests[response.currentQuicktest];
			questions = qt.questions;

			// console.log(exam, questions);

			getNewQuestion();
		},
		error: function(error) {
			console.log(error);
			alert("AJAX request failed.");
		}
	});
	

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
			url: "api/randomquestion",
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

	// Saves a result either as 0 (wrong answer) or 1 (right answer)
	function saveResult(success) {
		$.ajax({
			url: '/api/answerQuicktest',
			type: 'get',
			data: {correct:success},
			success : function(response) {
				console.log(response);
			},
			error : function(response) {
				console.log(response);
			}
		});
		/*
		if(window.localStorage['stats.quicktests.total'] == null) {
			window.localStorage['stats.quicktests.total'] = 0;
			window.localStorage['stats.quicktests.correct'] = 0;
		}

		var total = window.localStorage['stats.quicktests.total'];
		window.localStorage['stats.quicktests.total'] = ++total;

		if(success) {
			var correct = window.localStorage['stats.quicktests.correct'];
			window.localStorage['stats.quicktests.correct'] = ++correct;
		}*/
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
		var id = e.dataTransfer.getData('index');			// The id of the dragged text

		// API call to answer the question
		var node = $(this);
		$.ajax({
			url:'/api/submitAnswer',
			type:'post',
			data: {
				evaltype:'quicktest',
				questionNb: questionNumber,
				answer: id
			},
			success: function(response) {
				// Refresh model
				qt = response.quicktests[response.currentQuicktest];
				questions = qt.questions;

				// Check if we answered correctly
				if (qt.answers[questionNumber] == questions[questionNumber].correctanswerindex) {
					node.css('border-color', 'green');
				} else {
					node.css('border-color', 'red');
				}

				correctQuestion = qt.questionsSuccess;
			},
			error : function(resp) {

			}
		});

		// $(this).text(e.dataTransfer.getData('text'));
		// if(e.dataTransfer.getData('index') == correctAnswer) {
		// 	$(this).css('border-color', 'green');
		// 	correctQuestion++;
		// 	saveResult(1);
		// } else {
		// 	$(this).css('border-color', 'red');
		// 	saveResult(0);
		// }
		answered = true;
	}
});