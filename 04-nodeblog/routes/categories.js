var express = require('express');
var router = express.Router();
var mongo = require('mongodb');
var db = require('monk')('localhost/nodeblog');

router.get('/show/:category', function (req, res, next) {
	var db = req.db;
	var posts = db.get('posts');
	posts.find({category : req.params.category}, {}, function (err, posts) {
		res.render('index', {
			'title' : req.params.category,
			'posts' : posts
		});
	});
});

router.get('/add', function (req, res, next) {
	res.render('addcategory', {
		'title' : 'Add Category'
	});
});

router.post('/add', function (req, res, next) {
	// get form values
	var title 		= req.body.title;

	// form validation
	req.checkBody('title', 'Title is required').notEmpty();

	// check for errors
	var errors = req.validationErrors();

	var categories = db.get('categories');
	if (errors) {
		// var categories = db.get('categories');

		categories.find({}, {}, function (err, categories) {
			res.render('addcategory', {
				'errors' : errors,
				'title' : title
			});
		});
			
	} else {
		// var categories = db.get('categories');

		// submit to db
		categories.insert({
			'title' : title
		}, function (err, categiry) {
			if (err) {
				res.send('There was an issue submitting the category');
			} else {
				req.flash('success', 'Category submitted');
				res.location('/');
				res.redirect('/');
			}
		});
	}


});

module.exports = router;