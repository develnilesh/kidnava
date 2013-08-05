
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path')
  , api = require('./routes/api')
  , passport = require('passport')
  , GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

var app = express();

// App configuration
app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.set('view options', {
    layout: false
  });

  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.cookieParser('your secret here'));
  app.use(express.session());

  app.use(express.bodyParser());
  app.use(express.methodOverride());

  // Initialize Passport!  Also use passport.session() middleware, to support
  // persistent login sessions (recommended).
  app.use(passport.initialize());
  app.use(passport.session());

  app.use(express.static(__dirname + '/public'));
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
});


// Passport session setup.
//   To support persistent login sessions, Passport needs to be able to
//   serialize users into and deserialize users out of the session.  Typically,
//   this will be as simple as storing the user ID when serializing, and finding
//   the user by ID when deserializing.  However, since this example does not
//   have a database of user records, the complete Google profile is
//   serialized and deserialized.
passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

passport.use(new GoogleStrategy({
    clientID: process.argv[2],
    clientSecret: process.argv[3],
    callbackURL: "http://ec2-54-213-102-86.us-west-2.compute.amazonaws.com:8080/auth/google/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    // asynchronous verification, for effect...
    process.nextTick(function () {
      
      // To keep the example simple, the user's Google profile is returned to
      // represent the logged-in user.  In a typical application, you would want
      // to associate the Google account with a user record in your database,
      // and return that user instead.
      return done(null, profile);
    });
    User.findOrCreate({ googleId: profile.id }, function (err, user) {
      return done(err, user);
    });
  }
));


// Set the route middleware for verifying google accounts.
// TODO: add facebook and twitter and local.
// GET /auth/google
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  The first step in Google authentication will involve
//   redirecting the user to google.com.  After authorization, Google
//   will redirect the user back to this application at /auth/google/callback
app.get('/auth/google',
  passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/userinfo.profile',
                                            'https://www.googleapis.com/auth/userinfo.email'] }),
  function(req, res){
    // The request will be redirected to Google for authentication, so this
    // function will not be called.
  });

app.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
  });

// Login
app.post('/login',
    passport.authenticate('google', { successRedirect: '/',
                                      failureRedirect: '/login' }),
    function(req, res){
      res.render('login');
});

app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});


// Routes
app.get('/',
  ensureAuthenticated,
  function(req, res) {
    res.render('index', { user: req.user });
});

// Login
app.get('/login', routes.index);
app.get('/partials/:name', routes.partials);

// JSON API
app.post('/api/addName', api.addName);
app.delete('/api/name/:id', api.deleteName);

// redirect all others to the index (HTML5 history)
app.get('*', ensureAuthenticated, routes.index);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

// Simple route middleware to ensure user is authenticated.
//   Use this route middleware on any resource that needs to be protected.  If
//   the request is authenticated (typically via a persistent login session),
//   the request will proceed.  Otherwise, the user will be redirected to the
//   login page.
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/login');
}
