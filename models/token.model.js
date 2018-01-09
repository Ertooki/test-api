var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

var TokenSchema = new mongoose.Schema({
    token: {
        type: String
    },
    uid: {
        type: String
    },
    roll: {
      type: Number,
      default: 0
    },
    updatedAt: {
       type: Date,
       expires: 600,
       default: Date.now
   }
},
{ timestamps: { createdAt: 'created_at' } });

TokenSchema.statics.getIt = function(token){
  var model = mongoose.model("Token", TokenSchema);
  return model.findOne({token: token}).exec();
}

TokenSchema.statics.generate = function(user){
  return genToken(user)
    .then(function(token){
      var model = mongoose.model("Token", TokenSchema);
      var new_token = new model({token: token, uid: user.id.id});
      return new_token.save();
    })
}

TokenSchema.statics.roll = function(token){
  var model = mongoose.model("Token", TokenSchema);
  return model.findOne({token: token}).exec()
    .then(function(token){
      if(token) {
        token.roll++;
        return token.save();
      }
      else throw new Error(JSON.stringify({status: 500, msg: "Token expired or do not exist"}));
    })
}

TokenSchema.statics.removeOne = function(token){
  var model = mongoose.model("Token", TokenSchema);
  return model.remove({token: token}).exec();
}

TokenSchema.statics.removeAll = function(id){
  var model = mongoose.model("Token", TokenSchema);
  return model.remove({uid: id}).exec();
}

function genToken(user){
    return new Promise(function(resolve,reject){
        bcrypt.hash(user, bcrypt.genSaltSync(12), null, function(err,hash){
            if (err) reject(new Error(err));
            else resolve(hash);
        });
    });
}

module.exports = mongoose.model("Token", TokenSchema);
