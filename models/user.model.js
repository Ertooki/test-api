var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var libphone = require('libphonenumber-js');
var regex = require('regex-email');
var Token = require('./token.model');

var UserSchema = new mongoose.Schema({
    id: {
        type: mongoose.Schema.Types.Mixed
    },
    password: {
        type: String
    }
});

UserSchema.statics.findById = function(id, password){
  return findById(id);
}

UserSchema.statics.signup = function(id, password){
  return findById(id)
    .then(function(user){
      if(user) throw new Error(JSON.stringify({status:500,msg:'User already registered'}));
      return genPassword(password);
    })
    .then(function(hash){
      var model = mongoose.model("User", UserSchema);
      var type = 'unknown';
      if(libphone.is_valid_number(libphone.parse(id))) type = 'phone';
      else if(regex.test(id)) type = 'email';
      var new_user = new model({id: {id: id, type: type}, password: hash});
      return new_user.save();
    })
    .then(function(user){
      return Token.generate(user);
    })
}

UserSchema.statics.signin = function(id, password){
  return findById(id)
    .then(function(user){
      if(user) return checkPassword(user, password);
      else throw new Error(JSON.stringify({status: 500, msg:'User does not exist'}));
    })
    .then(function(result){
      console.log(result);
      if (result.check) return Token.generate(result.user);
      else throw new Error(JSON.stringify({status: 500, msg:'Wrong password'}));
    })
}

function findById (id){
    var model = mongoose.model("User", UserSchema);
    return model.findOne({ "id.id": id  }).exec();
}

function genPassword(password){
    return new Promise(function(resolve,reject){
        bcrypt.hash(password, bcrypt.genSaltSync(12), null, function(err,hash){
            if (err) reject(new Error(err));
            else resolve(hash);
        });
    });
}

function checkPassword(user, password){
    return new Promise(function(resolve,reject) {
        bcrypt.compare(password, user.password, function(err, res){
            if(err) reject(err);
            else resolve({ check: res, user: user});
        });
    });
}

module.exports = mongoose.model("User", UserSchema);
