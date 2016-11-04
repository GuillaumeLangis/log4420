var express = require('express');
var router = express.Router();

var db = require('./db');

/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('index', { title: 'Acceuil' });
});

router.get('/instructions', function(req, res, next) {
	res.render('instructions', {title: 'Instructions'});
});

router.get('/mypage', function(req, res, next) {
	db.Statistics.findOne({"_id":0}, function(err, stats) {
		if (err) console.log(err);

		var average = 0;
		stats.exams.forEach(function(ex) {
			average += ex.questionsSuccess/ex.questionsTotal;
		});
		average /= stats.exams.length;
		average *= 100;
		console.log(stats, average);

		res.render('mypage', 
			{
				title: 'Tableau de Bord',
				statistics: stats,
				average: average
			});
	});
});

router.get('/quicktest', function(req, res, next) {
	res.render('quicktest', {title: 'Question Rapide #1'});
});

router.get('/quicktest2', function(req, res, next) {
	res.render('quicktest2', {title: 'Question Rapide #2'});
});

router.get('/test', function(req, res, next) {
	res.render('test', {title: 'Question #1 sur 2'});
});

router.get('/test2', function(req, res, next) {
	res.render('test2', {title: 'Question #2 sur 2'});
});

router.get('/results', function(req, res, next) {
	res.render('results', {title: 'Résultats'});
});

router.get('/questions', function(req, res, next) {
	db.Question.find(function(err, questions, count) {
		if (err) console.log(err);

		res.render('questions', {
			title:'Questions',
			questions : questions,
			count : count
		});
	});
});

router.get('/addquestion', function(req, res, next) {
	res.render('addquestion', {title: 'Ajouter Question'});
});

router.post('/addquestion', db.create);
router.get('/deletequestion', db.delete);


module.exports = router;
