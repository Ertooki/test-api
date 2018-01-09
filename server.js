var express = require('express');
var bodyParser = require('body-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
var cors = require('cors');
var isJSON = require('is-json');
var http = require('http');
var tcpp = require('tcp-ping');

// Config file
var config = require('./config');

// Configuring DB
mongoose.connect(config.mongo_uri, {useMongoClient: true, promiseLibrary: require('bluebird')});

// Models
var User = require('./models/user.model');
var Token = require('./models/token.model');

var app = express();

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

app.post('/signup', function(req,res){
  User.signup(req.body.id, req.body.password)
    .then(function(token){
      res.json({status: 200, token: token.token});
    })
    .catch(function(error){
      if (isJSON(error.message)) return res.json(JSON.parse(error.message));
      else return res.json({status: 500, msg: error.message});
    })
});

app.post('/signin', function(req,res){
  User.signin(req.body.id, req.body.password)
  .then(function(token){
    res.json({status: 200, token: token.token});
  })
  .catch(function(error){
    if (isJSON(error.message)) return res.json(JSON.parse(error.message));
    else return res.json({status: 500, msg: error.message});
  })
});

app.get('/info', verifyToken, function(req,res){
  if(!req.query.id) res.json({status:500, msg:"Not sufficient params!"});
  else {
    User.findById(req.query.id)
      .then(function(user){
        if(user) res.json({status:200,user:user.id});
        else res.json({status:500,msg:"User not found"});
      })
      .catch(function(error){
        if (isJSON(error.message)) return res.json(JSON.parse(error.message));
        else return res.json({status: 500, msg: error.message});
      })
  }
});

app.get('/latency', verifyToken, function(req,res){
  tcpp.ping({ address: 'google.com' }, function(err, data) {
    if(err) res.json({status: 500, msg: err});
    else res.json({status:200,msg:data.avg});
  });
});

app.get('/logout', verifyToken, function(req,res){
  if(req.query.all === undefined) res.json({status:500, msg:"Not sufficient params!"});
  else {
    var auth_header = req.get('Authorization');
    var token = auth_header.substring(7);
    Token.getIt(token)
        .then(function(token){
          if(req.query.all == 'true') return Token.removeAll(token.uid);
          else if(req.query.all == 'false') return Token.removeOne(token.token);
        })
        .then(function(removed){
          return res.json({status: 200, rm: removed});
        })
        .catch(function(error){
          if (isJSON(error.message)) return res.json(JSON.parse(error.message));
          else return res.json({status: 500, msg: error.message});
        })
  }
});

function verifyToken(req,res,next){
  var auth_header = req.get('Authorization');
  if(auth_header) {
    var token = auth_header.substring(7);
    Token.roll(token)
      .then(function(token){
        return next();
      })
      .catch(function(error){
        if (isJSON(error.message)) return res.json(JSON.parse(error.message));
        else return res.json({status: 500, msg: error.message});
      })
  }
  else res.json({status: 500, msg: "Not authorized!"});
}

var server = http.createServer(app);
server.listen(3000);
