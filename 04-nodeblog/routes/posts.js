var express = require('express');
var router = express.Router();
var mongo = require('mongodb');
var db = require('monk')('localhost/nodeblog');

router.get('/add', function(req, res, next) {
	var categories = db.get('categories');

	categories.find({}, {}, function(err, categories) {
		res.render('addpost', {
			'title' : 'Add Post',
			'categories' : categories
		});
	});

		
});

router.post('/add', function (req, res, next) {
	// get form values
	var title 		= req.body.title;
	var category 	= req.body.category;
	var body 		= req.body.body;
	var author 		= req.body.author;
	var date 		= new Date();

	// check images
	if (req.files.mainimage) {
		var mainImageOriginalName 	= req.files.mainimage.originalname;
		var mainImageName 			= req.files.mainimage.name;
		var mainImageMime			= req.files.mainimage.mimetype;
		var mainImagePath			= req.files.mainimage.path;
		var mainImageExt			= req.files.mainimage.extension;
		var mainImageSize			= req.files.mainimage.size;



	} else {
		var mainImageName = 'noimage.jpg';
	}

	// form validation
	req.checkBody('title', 'Title is required').notEmpty();
	req.checkBody('body', 'Text body is required').notEmpty();

	// check for errors
	var errors = req.validationErrors();

	if (errors) {
		var categories = db.get('categories');

		categories.find({}, {}, function (err, categories) {
			res.render('addpost', {
				'errors' : errors,
				'title' : title,
				'body' : body,
				'categories' : categories
			});
		});
			
	} else {
		var posts = db.get('posts');

		// submit to db
		posts.insert({
			'title' : title,
			'body' : body,
			'category' : category,
			'date' : date,
			'author' : author,
			'mainimage' : mainImageName
		}, function (err, post) {
			if (err) {
				res.send('There was an issue submitting the post');
			} else {
				req.flash('success', 'Post submitted');
				res.location('/');
				res.redirect('/');
			}
		});
	}


});

module.exports = router;