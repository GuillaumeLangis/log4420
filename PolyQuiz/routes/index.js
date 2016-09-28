var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('index', { title: 'Acceuil' });
});

router.get('/instructions', function(req, res, next) {
	res.render('instructions', {title: 'Instructions'});
});

router.get('/mypage', function(req, res, next) {
	res.render('mypage', {title: 'Tableau de Bord'});
});

module.exports = router;
