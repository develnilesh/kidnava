
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
    res.render('index', { user: req.user.first });
});

// Login
app.get('/login', routes.index);
app.get('/partials/:name', routes.partials);

// JSON API
app.post('/api/addSuggestion', ensureAuthenticated, api.addSuggestion);
app.get('/api/names/:prefix', ensureAuthenticated, api.getNames);

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

}
