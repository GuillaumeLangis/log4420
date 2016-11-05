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

	var nbQuestion = window.sessionStorage['current.nbQuestions'];
	var domaine = window.sessionStorage['current.domain'];
	$('#domain').text(domaine);

	var correctQuestion = 0;
	var questionNumber = 0;
	var answered = false;
	var currentAnswer;
	var questions;

	var exam;


	// To start the exam, we call the api "start"
	// We then get the questions generated


	$.ajax({
		url: "/api/start",
		type: "post", 
		data: {
			evaltype: 'exam',
			domain: domaine, 
			total: nbQuestion
		},
		success: function(response) {
			exam = response.exams[response.currentExam];
			questions = exam.questions;

			// console.log(exam, questions);

			displayNextQuestion();
		},
		error: function(error) {
			console.log(error);
			alert("AJAX request failed.");
		}
	});

	function displayNextQuestion() {
		displayStatistics(0);

		resetQuestionStyles();

	 	$('#questionProgress').text(correctQuestion + '/' + nbQuestion);
	 	
	 	var questionTitleNumber = questionNumber + 1;
	 	$('#questionTitle').text('Question ' + questionTitleNumber);
		var currentQuestion = questions[questionNumber];

		$('#askedQuestion').text(currentQuestion.question);
		$('#answer1').text(currentQuestion.answers[0]);
		$('#answer2').text(currentQuestion.answers[1]);
		$('#answer3').text(currentQuestion.answers[2]);
		setCorrectAnswer(currentQuestion.correctanswerindex);
	}

	$('#next.quiz-navig-btn').on('click', function() {
		if(answered) {
			if(++questionNumber == nbQuestion) {
				// window.sessionStorage['current.correctAnswers'] = correctQuestion;
				window.location = "/results";
			} else {
				displayNextQuestion();
			}
		}
	});

	$('#prev.quiz-navig-btn').on('click', function() {
		window.sessionStorage['current.correctAnswers'] = 0;
		window.location = "/results";
	});

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
				evaltype:'exam',
				questionNb: questionNumber,
				answer: id
			},
			success: function(response) {
				// Refresh model
				exam = response.exams[response.currentExam];
				questions = exam.questions;

				// Check if we answered correctly
				if (exam.answers[questionNumber] == questions[questionNumber].correctanswerindex) {
					node.css('border-color', 'green');
				} else {
					node.css('border-color', 'red');
				}

				correctQuestion = exam.questionsSuccess;
			},
			error : function(resp) {

			}
		});
		// TODO
		// if (id == correctAnswer) {
		// 	$(this).css('border-color', 'green');
		// 	correctQuestion++;
		// } else {
		// 	$(this).css('border-color', 'red');
		// }
		answered = true;
	}
});