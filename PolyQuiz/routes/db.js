var mongoose = require( 'mongoose' );
var autoincrement = require('mongoose-auto-increment');
var random = require('mongoose-simple-random');

var Schema = mongoose.Schema;

var questionSchema = new Schema({
	_id					: Number,
	domain				: String,
	question 			: String,
	answers				: [String],
	correctanswerindex	: Number
}, {
	collection : 'Questions'
});


var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  // console.log("DONE");
});


const connection = mongoose.connect( 'mongodb://admin:password@ds017432.mlab.com:17432/log4420' );
exports.connect = connection;

autoincrement.initialize(connection);

questionSchema.plugin(autoincrement.plugin, 'Questions');
questionSchema.plugin(random);

const Question = mongoose.model( 'Question', questionSchema );
exports.Question = Question;

exports.create = function (req, res) {
	new Question({
		question 			: req.body.question,
		answers				: [req.body.answer1, req.body.answer2, req.body.answer3],
		correctanswerindex	: req.body.correctanswerindex
	}).save(function(err, todo, count) {
		if (err) console.log(err);
		res.redirect('/questions');
	});
}