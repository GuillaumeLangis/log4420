var mongoose = require( 'mongoose' );
var autoincrement = require('mongoose-auto-increment');
var random = require('mongoose-simple-random');

var Schema = mongoose.Schema;

var questionSchema = new Schema({
	_id					: String,
	domain				: String,
	question 			: String,
	answers				: [String],
	correctanswerindex	: Number
}, {
	collection : 'Questions'
});
var statisticsSchema = new Schema({
	_id					: Number,
	quicktests			: [
		{
			questionsTotal		: Number,
			questionsSuccess	: Number
		}
	],
	exams				: [
		{
			domain				: String,
			questionsTotal		: Number,
			questionsSuccess	: Number
		}
	]
}, {
	collection : 'Statistics'
});


var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  // console.log("DONE");
});


const connection = mongoose.connect( 'mongodb://admin:password@ds017432.mlab.com:17432/log4420' );
exports.connect = connection;

autoincrement.initialize(connection);

questionSchema.plugin(autoincrement.plugin, 
	{
		model: 'Questions',
		field: '_id',
		startAt: 100
	});
questionSchema.plugin(random);

const Question = mongoose.model( 'Question', questionSchema );
exports.Question = Question;

const Statistics = mongoose.model( 'Statistics', statisticsSchema );
exports.Statistics = Statistics;

exports.create = function (req, res) {

	if (req.body.question.length == 0 ||
		req.body.answer1.length == 0 ||
		req.body.answer2.length == 0 ||
		req.body.answer3.length == 0 ||
		req.body.correctanswerindex < 1 ||
		req.body.correctanswerindex > 3 ||
		(req.body.domain != 'html' && req.body.domain != 'js' && req.body.domain != 'css'))
	{
		res.status(400);
		res.render('error', {
			error : 'Question invalide',
			status : 400
		});
	} else {
		new Question({
			question 			: req.body.question,
			domain				: req.body.domain,
			answers				: [req.body.answer1, req.body.answer2, req.body.answer3],
			correctanswerindex	: (req.body.correctanswerindex-1)
		}).save(function(err, todo, count) {
			if (err) {
				console.log(err);
			} else {
				res.redirect('/questions');
			}
		});
	}
}

exports.delete = function (req, res) {
	// console.log(req.query._id);
	Question.findById( req.query._id, function ( err, question ){
		question.remove( function ( err, todo ){
			res.redirect( '/questions' );
		});
	});
}

exports.addQuickTest = function (req, res) {
	console.log(req.questionsTotal, req.questionsSuccess);
}
exports.addExam = function (req, res) {
	console.log(req.domain, req.questionsTotal, req.questionsSuccess);
}