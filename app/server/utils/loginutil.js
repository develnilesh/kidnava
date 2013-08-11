'use strict';

var uuid = require('uuid-v4');
var User = require('../db/user');

exports.loginOrCreate = function(provider, profile, done) {
  var providerId = {};
  debugger;
  providerId[provider + '.id'] = profile.id;

  //find by oauth2 provider
  User.findOne(providerId, function(err, user) {
    if (err) { return done(err); }
    if (!user) {
      user = new User({
              first: profile.name.givenName || profile.given_name
            , last: profile.name.familyName || profile.family_name
            , email: profile.emails[0].value
            , gender: profile.gender || profile._json.gender
            , password: uuid()
          });
      user[provider] = profile._json;
      user.save(function(err) {
	return done(err, user);
      });
    
    } else {
      return done(null, user);
    }});
};
