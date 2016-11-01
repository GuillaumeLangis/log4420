function displayStatistics(modal) {
	$(document).ready(function() 
	{
		if(window.localStorage['stats.exams.count'] == null) {
			initResults();
		}

		var testCorrect = window.localStorage['stats.quicktests.correct'];
		var testTotal = window.localStorage['stats.quicktests.total'];

		var examCount = window.localStorage['stats.exams.count'];
		var examAverage = window.localStorage['stats.exams.average'];

		var examCssTotal = window.localStorage['stats.exams.domain.css.total'];
		var examCssPassed = window.localStorage['stats.exams.domain.css.passed'];

		var examJsTotal = window.localStorage['stats.exams.domain.js.total'];
		var examJsPassed = window.localStorage['stats.exams.domain.js.passed'];

		var examHtmlTotal = window.localStorage['stats.exams.domain.html.total'];
		var examHtmlPassed = window.localStorage['stats.exams.domain.html.passed'];

		$('#stats-quicktests').text(testCorrect + '/' + testTotal);
		$('#stats-exams-average').text(parseFloat(examAverage).toFixed(2) * 100 + '%');
		$('#stats-exams-css').text(examCssPassed + '/' + examCssTotal);
		$('#stats-exams-js').text(examJsPassed + '/' + examJsTotal);
		$('#stats-exams-html').text(examHtmlPassed + '/' + examHtmlTotal);

		if (modal) {
			$('#modal-quicktests').text(testCorrect + '/' + testTotal);
			$('#modal-exams-average').text(parseFloat(examAverage).toFixed(2) * 100 + '%');
			$('#modal-exams-css').text(examCssPassed + '/' + examCssTotal);
			$('#modal-exams-js').text(examJsPassed + '/' + examJsTotal);
			$('#modal-exams-html').text(examHtmlPassed + '/' + examHtmlTotal);
		}
	});
}

function displayDetails() {
	$(document).ready(function() 
	{	
		var examCount = window.localStorage['stats.exams.count'];

		var examTable = document.getElementById('details-exams-table');

		while(examTable.hasChildNodes()){
	    	examTable.removeChild(examTable.lastChild);
		}
		
		for(var i = 0; i < examCount; i++) {
			var examCorrect = window.localStorage['stats.exams.' + i + '.correct'];
			var examTotal = window.localStorage['stats.exams.' + i + '.total'];
			var examDomain = window.localStorage['stats.exams.' + i + '.domain'];
			var row = examTable.insertRow();

			var examTitle = row.insertCell(0);
			var examResult = row.insertCell(1);

			examTitle.innerHTML = 'Examen #' + i + ' - ' + examDomain;
			examResult.innerHTML = examCorrect + '/' + examTotal;
		}
	});
}

function saveResults(correct, total, domaine) {
	$(document).ready(function() 
	{
		var percentage = correct / total;
		var count = window.localStorage['stats.exams.count'];
		var domainTotal = window.localStorage['stats.exams.domain.' + domaine + '.total'];

		window.localStorage['stats.exams.' + count + '.correct'] = correct;
		window.localStorage['stats.exams.' + count + '.total'] = total;
		window.localStorage['stats.exams.' + count + '.percentage'] = percentage;
		window.localStorage['stats.exams.' + count + '.domain'] = domaine;
		window.localStorage['stats.exams.count'] = ++count;
		window.localStorage['stats.exams.domain.' + domaine + '.total'] = ++domainTotal;
		
		if(percentage >= 0.5) {
			var domainPassed = window.localStorage['stats.exams.domain.' + domaine + '.passed'];
			window.localStorage['stats.exams.domain.' + domaine + '.passed'] = ++domainPassed;
		} 

		var percentageSum = 0;
		for(var i = 0; i < count; i++) {
			percentageSum += parseFloat(window.localStorage['stats.exams.' + i + '.percentage']);
		}
		var average = percentageSum / count;
		window.localStorage['stats.exams.average'] = average;
	});
}

function initResults() {
	// TODO remove all exams individual results!
	var count = window.localStorage['stats.exams.count'];
	for(var i = 0; i < count; i++) {
		window.localStorage.removeItem('stats.exams.' + i + '.correct');
		window.localStorage.removeItem('stats.exams.' + i + '.total');
		window.localStorage.removeItem('stats.exams.' + i + '.percentage');
		window.localStorage.removeItem('stats.exams.' + i + '.domain');
	}

	window.localStorage['stats.exams.count'] = 0;
	window.localStorage['stats.exams.average'] = 0;

	window.localStorage['stats.exams.domain.css.total'] = 0;
	window.localStorage['stats.exams.domain.html.total'] = 0;
	window.localStorage['stats.exams.domain.js.total'] = 0;
	window.localStorage['stats.exams.domain.css.passed'] = 0;
	window.localStorage['stats.exams.domain.html.passed'] = 0;
	window.localStorage['stats.exams.domain.js.passed'] = 0;

	window.localStorage['stats.quicktests.correct'] = 0;
	window.localStorage['stats.quicktests.total'] = 0;
}

// drag and drop
var correctAnswer;

function setCorrectAnswer(index) {
	correctAnswer = index;
}

function handleAnswerDragStart(e) {
	this.style.opacity = '0.4';

	dragSrcEl = this;

	e.dataTransfer.effectAllowed = 'move';
	e.dataTransfer.setData('index', $(this).attr('index'));
	e.dataTransfer.setData('text', $(this).text());
}

function handleAnswerDragStart(e) {
	this.style.opacity = '0.4';

	dragSrcEl = this;

	e.dataTransfer.effectAllowed = 'move';
	e.dataTransfer.setData('index', $(this).attr('index'));
	e.dataTransfer.setData('text', $(this).text());
}

function handleAnswerDragEnd(e) {
	this.style.opacity = '1';
}

function handleAnswerBoxDragOver(e) {
	if (e.preventDefault) {
		e.preventDefault(); // Necessary. Allows us to drop.
	}

	e.dataTransfer.dropEffect = 'move';  // See the section on the DataTransfer object.

	return false;
}

function handleAnswerBoxDragEnter(e) {
	// this / e.target is the current hover target.
	this.classList.add('over');
}

function handleAnswerBoxDragLeave(e) {
	this.classList.remove('over');  // this / e.target is previous target element.
}

function resetQuestionStyles() {
	var answers = $('#answer .possibleAnswer');
	[].forEach.call(answers, function(answer) {
		answer.setAttribute('draggable', 'true');
		answer.style.cursor = 'move';
	});

	var answerBox = document.querySelector('#answerbox');
	answerBox.style.borderColor = 'black';
	answerBox.innerHTML = '';
}