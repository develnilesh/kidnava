'use strict';

var uuid = require('uuid-v4');
var User = require('../db/user');

exports.loginOrCreate = function(provider, profile, accessToken, refreshToken, done) {
  var providerId = {};
  providerId[provider + '.id'] = profile.id;
  console.log('Profile:' + JSON.stringify(profile));
  //find by oauth2 provider
  User.findOne(providerId, function(err, user) {
    if (err) { return done(err); }
    if (!user) {
      user = new User({
              first: profile.name.givenName || profile.given_name
            , last: profile.name.familyName || profile.family_name
            , email: profile.emails[0].value
            , gender: profile.gender || profile._json.gender || 'unknown'
            , picture: profile._json.picture
            , password: uuid()
          });
      user[provider] = profile._json;
      user.access_token = accessToken;
      user.refresh_token = refreshToken;
      console.log('created profile:' + user);
      user.save(function(err) {
	return done(err, user);
      });
    } else {
      user.access_token = accessToken;
      user.refresh_token = refreshToken;
      user.save(function(err, data) {
        if (err) { return done(err); }
        return done(err, data);
      });
    }});
};

exports.registerLocalUser = function(newUser, callback) {
  User.findOne({email: newUser.username}, function(err, user) {
    if (err) { callback(false); }
    if (!user) {
      user = new User({
              first: newUser.first
            , last: newUser.last
            , email: newUser.username
            , gender: newUser.gender
            , hashed_password: newUser.password
          });
      console.log('created profile:' + user);
      user.save(function(err) {
	callback(true);
      });
    } else {
      callback(false);
    }
  });
};

exports.verifyLocalLogin = function (username, password, done) {
  User.findOne({ email: username }, function (err, user) {
    if (err) { return done(err); }
    if (!user) { return done(null, false); }
    if (!user.verifyPassword(password)) { return done(null, false); }
    return done(null, user);
  });
};

exports.isNewUsername = function (username, callback) {
  User.findOne({ email: username }, function (err, user) {
    if (err) { callback(false, "Failed query"); }
    if (!user) {
      callback(true);
    } else {
      callback(false);
    }
  });
};
