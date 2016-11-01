var express = require('express');
var router = express.Router();

var data = require('../data/questions');

router.get('/test', function(req, res, next) {
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

    res.json(response);
});

router.get('/quicktest', function(req, res, next) {
	var index = Math.floor(Math.random() * 11);	

	res.json(data[index]);
});

module.exports = router;