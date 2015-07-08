var mongoose = require('mongoose');
var bcrypt = require('bcryptjs'); // npm install bcryptjs for mac

// connect to db
mongoose.connect('mongodb://localhost/nodeauth');

var db = mongoose.connection;

// user schema
var UserSchema = mongoose.Schema({
	username : {
		type : String,
		index : true
	},
	password : {
		type : String, required: true, bcrypt : true
	},
	email : {
		type : String
	},
	name : {
		type : String
	},
	profileImage : {
		type : String
	}
});

var User = module.exports = mongoose.model('User', UserSchema); 
// guess the previous line is where mongoose knows the collection we use is users
// http://stackoverflow.com/questions/10547118/why-does-mongoose-always-add-an-s-to-the-end-of-my-collection-name

module.exports.comparePassword = function (candidatePassword, hash, callback) {
	bcrypt.compare(candidatePassword, hash, function (err, isMatch) {
		if (err) return callback(err);
		callback(null, isMatch);
	});
};

module.exports.getUserByUsername = function (username, callback) {
	var query = { username : username };
	User.findOne(query, callback);
};

module.exports.getUserById = function (id, callback) {
	// var query = { username : username };
	User.findById(id, callback);
};

module.exports.createUser = function (newUser, callback) {
	bcrypt.hash(newUser.password, 10, function (err, hash) { // 10 = salt
		if (err) throw err;
		// set hashed password
		newUser.password = hash;

		// create user
		newUser.save(callback);
	});
	
};