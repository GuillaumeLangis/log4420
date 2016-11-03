var express = require('express');
var bodyParser = require('body-parser');
var router = express.Router();
var db = require('./db');

var data = require('../data/questions');

router.get('/test', function(req, res, next) {

	var response = {};

	var filter = { domain: { $in: [req.query.domain] } };

	try {
		db.Question.findRandom(filter, {}, {limit: parseInt(req.query.nbQuestions)}, function(err, results) {
			if (!err) {
				response = results;
			}

			res.json(response);
		});
	} catch(err) {
		console.log("Error", err);
		res.json({});
	}
});

router.get('/quicktest', function(req, res, next) {

	var response = {};
	try {
		db.Question.findRandom({}, {}, {limit: 1}, function(err, results) {
			if (!err) {
				response = results[0];
			}

			res.json(response);
		});
	} catch(err) {
		console.log("Error", err);
		res.json({})
	}
});

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