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
		res.json({})
	}
	
	

	/*
	var index;

	// index [0,3] = CSS
	// index [4,7] = HTML
	// index [8,11] = JS
	switch(req.query.domain) {
	    case 'css':
	    	index = 0;
	        break;
	    case 'html':
	    	index = 4;
	        break;
	    case 'js':
	    	index = 8;
	        break;
    }

    var response = [];
    for(var i = 0; i < parseInt(req.query.nbQuestions); i++) {
    	response.push(data[index + i]);
    }

    res.json(response);*/
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


	// var index = Math.floor(Math.random() * 11);	

	// res.json(data[index]);
});

router.get('/questions', function(req, res, next) {
	
})

module.exports = router;