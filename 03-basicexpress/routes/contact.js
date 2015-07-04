var express = require('express');
var router = express.Router();
var nodemailer = require('nodemailer');

/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('contact', { title: 'Contact' });
});

router.post('/send', function(req, res, next) {
	var transporter = nodemailer.createTransport({
		service: 'Gmail',
		auth: {
			user : 'blablaz@gmail.com',
			pass : 'nyamnyam'
		}
	});

	var mailOptions = {
		from: 'John Doe <johndoe@gmail.com>',
		to: 'blablaz@gmail.com',
		subject: 'email subject',
		text : 'you got mail from ' + req.body.name + '<' + req.body.email+ '> who said ' + req.body.message,
		html: '<p>you got mail from ' + req.body.name + '<' + req.body.email+ '> who said ' + req.body.message + '</p>'
	};

	transporter.sendMail(mailOptions, function (error, info) {
		if (error) {
			console.log(error);
			res.redirect('/');
		} else {
			console.log('message sent: ' + info.response);
			res.redirect('/');
		}
	});
});

module.exports = router;