/**
 * Module dependencies.
 */

var express = require('express')
  , http = require('http')
  , path = require('path')
  , passport = require('passport')
  , GoogleStrategy = require('passport-google-oauth').OAuth2Strategy
  , LocalStrategy = require('passport-local').Strategy
  , login = require('./app/server/utils/loginutil')
  , user = require('./app/server/db/user')
  , mongoose = require('mongoose');

var app = express();


var mongodbURI = 'mongodb://@localhost:27017/kidnava';
mongoose.connect(mongodbURI);


// App configuration
app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/app/server/views');
  app.set('view engine', 'jade');
  app.set('view options', {
    layout: false
  });

  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.cookieParser('your secret here'));
  // IMPORTANT: This should come before passport.session().
  app.use(express.session());

  app.use(express.bodyParser());
  app.use(express.methodOverride());

  // Initialize Passport!  Also use passport.session() middleware, to support
  // persistent login sessions (recommended).
  app.use(passport.initialize());
  app.use(passport.session());

  app.use(express.static(__dirname + '/app/public'));
  app.use(app.router);

  // For stylus
  app.use(require('stylus').middleware(__dirname + '/public'));
  app.use(express.static(path.join(__dirname, 'public')));

});


// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
}

// Production only
app.configure('production', function(){
  app.use(express.errorHandler());
  app.use(express.csrf());
});


// Passport session setup.
//   To support persistent login sessions, Passport needs to be able to
//   serialize users into and deserialize users out of the session.  Typically,
//   this will be as simple as storing the user ID when serializing, and finding
//   the user by ID when deserializing.  However, since this example does not
//   have a database of user records, the complete Google profile is
//   serialized and deserialized.
passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  user.findById(id, function (err, user){
    done(err, user);
  });
});

passport.use(new GoogleStrategy({
    clientID: process.argv[2],
    clientSecret: process.argv[3],
    callbackURL: "http://ec2-54-213-102-86.us-west-2.compute.amazonaws.com:3000/auth/google/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    console.log("accessToken:" + accessToken);
    login.loginOrCreate('google', profile, accessToken, refreshToken, done);    
  }
));

passport.use(new LocalStrategy(
  function(username, password, done) {
    login.verifyLocalLogin(username, password, done);
  }
));

require('./app/server/router')(app);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});


