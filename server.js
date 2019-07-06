var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var bcrypt = require('bcryptjs');
var config = require('./config');
var mongoose = require('mongoose');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var LocalStrategy = require('passport-local').Strategy;
var jsonParser = bodyParser.json();


var app = express();
var passport = require('passport');




app.use(bodyParser.json());
app.use(express.static('public'));




app.use(session({
  secret: 'meda',
  resave: true,
  saveUninitialized: true,
  store: new MongoStore({ mongooseConnection: mongoose.connection })
}));
app.use(passport.initialize());
app.use(passport.session());

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();
    res.redirect('/');
}

var User = require('./models/userModel');

passport.use('local', new LocalStrategy(
  function(username, password, done) {
    User.findOne({ username: username }, function (err, user) {
        console.log(err);
      if (err) { return done(err); }
      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }
      validatePassword(password, user.password, function(error){
          if(error) {
              return done(null, false, { message: 'Incorrect password.' });
          } else {
              return done(null, user);
          }
      });
    });
  }
));

function validatePassword(password, userpassword, callback) {
    bcrypt.compare(password, userpassword, function(err, isValid) {
        if (err) {
            callback(err);
            return;
        }
        callback(null, isValid);
    });
}
passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});


app.post('/login', passport.authenticate('local'), function(req, res) {
  return res.status(200).json({
    alias: req.user.alias,
    username: req.user.username,
    isAuthenticated: true
  });
});

app.get('/logout', function(req, res){
    req.logout();
    res.sendStatus(200);
});


app.post('/users', jsonParser, function(req, res) {
    if (!req.body) {
        return res.status(400).json({
            message: 'No request body'
        });
    }
    if (!('username' in req.body)) {
        return res.status(422).json({
            message: 'Missing field: username'
        });
    }
    var username = req.body.username;
    if (typeof username !== 'string') {
        return res.status(422).json({
            message: 'Incorrect field type: username'
        });
    }
    username = username.trim();
    if (username === '') {
        return res.status(422).json({
            message: 'Incorrect field length: username'
        });
    }
    //
    // if (!('alias' in req.body)) {
    //     return res.status(422).json({
    //         message: 'Missing field: alias'
    //     });
    // }
    // var alias = req.body.alias;
    // if (typeof alias !== 'string') {
    //     return res.status(422).json({
    //         message: 'Incorrect field type: alias'
    //     });
    // }
    // alias = alias.trim();
    // if (username === '') {
    //     return res.status(422).json({
    //         message: 'Incorrect field length: alias'
    //     });
    //}
    //
    if (!('password' in req.body)) {
        return res.status(422).json({
            message: 'Missing field: password'
        });
    }
    var password = req.body.password;
    if (typeof password !== 'string') {
        return res.status(422).json({
            message: 'Incorrect field type: password'
        });
    }

    password = password.trim();

    if (password === '') {
        return res.status(422).json({
            message: 'Incorrect field length: password'
        });
    }
    bcrypt.genSalt(10, function(err, salt) {
        if (err) {
            return res.status(500).json({
                message: 'Internal server error'
            });
        }
        bcrypt.hash(password, salt, function(err, hash) {
            if (err) {
                return res.status(500).json({
                    message: 'Internal server error'
                });
            }
            var user = new User({
              // alias: alias,
                username: username,
                password: hash
            });
            user.save(function(err) {
                if (err) {
                    return res.status(500).json({
                        message: 'Internal server error'
                    });
                }
                return res.status(201).json({});
            });
        });
    });
});





var runServer = function(callback) {
    mongoose.connect(config.DATABASE_URL, function(err) {
        if (err && callback) {
            return callback(err);
        }

        app.listen(config.PORT, function() {
            console.log('Listening on localhost:' + config.PORT);
			 if (callback) {
                callback();
            }
			 // return res.status(200).json({message:'root url connected'})
       
        });
    });
};


if (require.main === module) {
    runServer(function(err) {
        if (err) {
            console.error(err);
        }
    });
};
module.exports.runServer = runServer;
module.exports.app = app;

app.get('/pieces', function(req,res){
    
    
    
    User.findOne({"_id":req.user._id}, function(err,user){
        //receives user from the callback
        console.log(err);
        return res.json(user.favorites);
        
    });
	
});

app.post('/pieces', function(req,res){
    
    var query = {"_id": req.user._id};
    var update = {$push:{favorites: {name: req.body.partName, part_id: req.body.partId, part_url: req.body.partURL, part_img_url: req.body.partImage, category: req.body.partDesc}}};

    User.findOneAndUpdate(query, update, function(err){
        
        console.log(err);
    
    	res.status(201).json({message:'piece added'});
    
});


});


app.delete('/pieces/:id', function(req,res){
    
    var query = {"_id": req.user.id};
    var update = {$pull:{favorites:{"_id":req.params.id}}};

    User.findOneAndUpdate(query, update, function(err){
        
        console.log(err);
    
    	res.status(200).json({message:'piece deleted'});
    
});


});

app.post('/favorites', function(req,res){
    
    var query = {"_id": req.user.id};
    
    var update = {$push:{favoriteGroup: {favoriteSet: req.body.favoriteSet}}};

    User.findOneAndUpdate(query, update, function(err){
        
        console.log(err);
        console.log("Your favorite set is " + req.body.favoriteSet);
    	res.status(201).json({message:'favorite added'});
    
    });

});
// app.get('/sets', function(req,res){
    
//   User.find({'favorites'}, function (err,favorites){
//   console.log(err);
//   console.log(favorites);
// });


// });