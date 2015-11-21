var mongoose = require('mongoose');
var bcrypt   = require('bcrypt');

// define the schema for our user model
var userSchema = mongoose.Schema({

        email        : String,
        password     : String
  
});

// methods ======================
// generating a hash
userSchema.methods.generateHash = function(password) {
	
	var salt = bcrypt.genSaltSync(10);
	console.log('salt:'+salt);
	console.log('password:'+password);
	console.log('hash:'+bcrypt.hashSync(password,salt));
	return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validPassword = function(password) {
	console.log("password: "+password);
	console.log("this.password :"+this.password);
	console.log(bcrypt.compareSync(password, this.password));
	return bcrypt.compareSync(password.trim, this.password.trim);
};

// create the model for users and expose it to our app
module.exports = mongoose.model('User', userSchema);
