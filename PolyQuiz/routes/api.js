var express = require('express');
var bodyParser = require('body-parser');
var router = express.Router();
var db = require('./db');

var data = require('../data/questions');

// Get statistics
router.get('/stats', function(req, res, next) {
	db.Statistics.findOne({"_id":0}, function(err, stats) {
		if (err) console.log(err);
		res.json(stats);
	});
});
// Completely clears all user statistics
router.post('/clearStats', function(req, res, next) {
	db.Statistics.findOne({"_id":0}, function(err, stats) {
		if (err) console.log(err);

		stats.currentQuicktest = -1;
		stats.currentExam = -1;
		stats.quicktests = [];
		stats.exams = [];

		stats.save(function(err, st) {
			if (err) console.log(err);
			else {
				console.log("Stats " + stats._id + " reset");
			}
		});

		res.json(stats);
	});
});

// Start a quick test or an exam
router.post('/start', function(req, res, next) {
	var type = req.body.evaltype;

	console.log("Starting new", type);
	db.Statistics.findOne({"_id":0}, function(err, stats) {
		if (err) console.log(err);

		// EXAM
		if (type == 'exam') {
			var domain = req.body.domain;
			var total = req.body.total;
			var questions = [];

			console.log("Exam", domain, total);

			// PICK QUESTIONS
			var filter = { domain: { $in: [domain] } };
			db.Question.findRandom(filter, {}, {limit: parseInt(total)}, function(err, results) { 
				questions = results; 

				// CREATE EXAM
				// This exam contains 
				// 	- questions selected randomly by domain
				//	- an empty list of answers
				//	- total stats on this exam
				// 	- the selected domain
				var new_exam = {
					domain 				: domain,
					questions 			: questions,
					answers 			: [],
					questionsTotal		: questions.length,
					questionsSuccess 	: 0
				}
				stats.currentExam = stats.exams.length;
				stats.exams.push(new_exam);

				stats.save(function(err, st) {
					if (err) console.log(err);
					else {
						console.log("Stats " + stats._id + " updated with new exam");
						console.log(qt);
					}

					res.json(stats);
				});
			});		
		}


		// QUICKTEST
		// TODO
		// 	- Setup new quicktest
		//	- Add one random question to queue
		if (type == 'quicktest') {
			if (stats.quicktests.length == 0) {
				// Create at least one quicktest
				var qt = {
					questions 			: [],
					answers 			: [],
					questionsTotal		: 0,
					questionsSuccess 	: 0
				}

				stats.currentQuicktest = 0;
				stats.quicktests.push(qt);
			} else {
				stats.currentQuicktest = stats.quicktests.length-1;
			}

			// Add a question
			db.Question.findRandom(filter, {}, {limit: 1}, function(err, results) { 
				stats.quicktests[stats.currentQuicktest].questions.push(results[0]);
				stats.quicktests[stats.currentQuicktest].questionsTotal = stats.quicktests[stats.currentQuicktest].questions.length;

				stats.save(function(err, st) {
					if (err) console.log(err);
					else {
						console.log("Stats " + stats._id + " updated with new quicktest");
						console.log(qt);
					}

					res.json(stats);
				});
			});
		}
		
	});
});

// Submit an answer to the current quicktest/exam
router.post('/submitAnswer', function(req, res, next) {
	var type = req.body.evaltype;
	var questionNb = req.body.questionNb;
	var answer = req.body.answer;

	console.log("Submitting answer to ", type);

	db.Statistics.findOne({"_id":0}, function(err, stats) {
		if (err) console.log(err);

		// EXAM
		if (type == 'exam') {
			if (stats.currentExam != -1) {
				var exam = stats.exams[stats.currentExam];

				exam.answers.push(parseInt(answer));		// Push the answer nb being submitted

				var question = exam.questions[questionNb];	// What's the question being answered?
				if (answer == question.correctanswerindex) {
					console.log("CORRECT");
					exam.questionsSuccess += 1;
				}

				// Save stats
				stats.save(function(err, st) {
					if (err) console.log(err);
					else {
						console.log("Stats " + stats._id + " saved");
					}
				});

			} else {
				console.log("ERROR ======= There is no current exam being evaluated")
			}
		}


		// QUICKTEST
		// TODO
		//	- validate just like exam
		//	- add another question to the queue (change question set)
		try {
			if (type == 'quicktest') {
				var qt = stats.quicktests[stats.currentQuicktest];

				qt.answers.push(parseInt(answer));				// Push the answer nb being submitted

				var question = qt.questions[questionNb];		// What's the question being answered?
				if (answer == question.correctanswerindex) {
					console.log("CORRECT");
					qt.questionsSuccess += 1;
				}


				// Add a question
				db.Question.findRandom({}, {}, {limit: 1}, function(err, results) { 
					stats.quicktests[stats.currentQuicktest].questions.push(results[0]);
					stats.quicktests[stats.currentQuicktest].questionsTotal = stats.quicktests[stats.currentQuicktest].questions.length;

					stats.save(function(err, st) {
						if (err) console.log(err);
						else {
							console.log("Stats " + stats._id + " updated with new quicktest");
							console.log(qt);
						}

						res.json(stats);
					});
				});
			}
		} catch (err) {
			console.log(err);
		}
		

		// res.json(stats);
	});
});

// Finish a quicktest/exam
router.post('/finish', function(req, res, next) {
	db.Statistics.findOne({"_id":0}, function(err, stats) {
		if (err) console.log(err);

		stats.currentQuicktest = -1;
		stats.currentExam = -1;

		stats.save(function(err, st) {
			if (err) console.log(err);
			else {
				console.log("Stats " + stats._id + " saved - evaluation finished.");
			}
		});

		res.json(stats);
	});
});

// Get a random question
router.get('/randomquestion', function(req, res, next) {
	db.Question.findRandom({}, {}, {limit: 1}, function(err, results) {
		if (!err) {
			response = results[0];
		}

		res.json(response);
	});
});

// Quick get of the number of questions of a certain domain
router.get('/nbquestions', function(req, res, next) {
	var domain = req.query.domain;
	// console.log(domain);
	db.Question.find(function(req, questions) {
		
		if (domain != "") {
			var questions = questions.filter(function(q) {return q.domain === domain;});
		}

		// console.log(questions.length);
		res.json( { count:questions.length } );
		
	});
});

module.exports = router;