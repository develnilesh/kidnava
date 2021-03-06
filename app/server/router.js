
var passport = require('passport');
var routes = require('./routes');
var api = require('./api/api');

module.exports = function(app) {

// Set the route middleware for verifying google accounts.
// TODO: add facebook and twitter and local.
// GET /auth/google
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  The first step in Google authentication will involve
//   redirecting the user to google.com.  After authorization, Google
//   will redirect the user back to this application at /auth/google/callback
app.get('/auth/google',
  passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/plus.login', 
					    'https://www.googleapis.com/auth/userinfo.profile',
					    'https://www.googleapis.com/auth/userinfo.email',
                                            'https://www.google.com/m8/feeds'] }),
  function(req, res){
    // The request will be redirected to Google for authentication, so this
    // function will not be called.
  });

app.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    console.log('login:' + res);
    res.redirect('/');
  });

// Login
app.post('/login',
    passport.authenticate('google', { successRedirect: '/',
                                      failureRedirect: '/login' }),
    function(req, res){
      res.render('login');
});

app.post('/lcllogin', 
  passport.authenticate('local', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/');
  });

app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/login');
});


// Routes
app.get('/',
  ensureAuthenticated,
  function(req, res) {
    res.render('index', { user: req.user });
});

// Login
app.get('/login', routes.index);
app.get('/register', routes.register);
app.get('/partials/:name', routes.partials);
app.get('/api/isNewUsername/:username', api.isNewUsername);
app.get('/activate/:token', api.activateUser);
app.get('/activated', function (req, res) {
  res.render('partials/activated');
});
app.get('/resendActivation', function (req, res) {
  res.render('partials/resendActivation');
});

// JSON API
app.post('/api/addBaby', ensureAuthenticated, api.addBaby);
app.post('/api/registerUser', api.addUser);
app.post('/api/addSuggestion', ensureAuthenticated, api.addSuggestion);
app.get('/api/names/:prefix', ensureAuthenticated, api.getNames);

// Get user info from g+ conect
app.get('/api/getUserInfo', ensureAuthenticated, api.getUserInfo);

// Third-party get info
app.get('/api/getContacts', ensureAuthenticated, api.getContacts);


// redirect all others to the index (HTML5 history)
app.get('*', ensureAuthenticated, routes.index);

// Simple route middleware to ensure user is authenticated.
//   Use this route middleware on any resource that needs to be protected.  If
//   the request is authenticated (typically via a persistent login session),
//   the request will proceed.  Otherwise, the user will be redirected to the
//   login page.
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/login');
}

};
