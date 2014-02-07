'use strict';

var uuid = require('node-uuid');
var User = require('../db/user');
var jade = require('jade');
var fs = require('fs');
var Mail = require('./mailerutil');
var Path = require('path');
var config = require('../config');

exports.loginOrCreate = function(provider, profile, accessToken, refreshToken, done) {
  var providerId = {};
  providerId[provider + '.id'] = profile.id;
  console.log('Profile:' + JSON.stringify(profile));
  //find by oauth2 provider
  User.findOne(providerId, function(err, user) {
    if (err) { return done(err); }
    if (!user) {
      user = new User({
              first: profile.name.givenName || profile.given_name,
              last: profile.name.familyName || profile.family_name,
              email: profile.emails[0].value,
              gender: profile.gender || profile._json.gender || 'unknown',
              picture: profile._json.picture,
              password: uuid(),
              active: true
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
      var token = uuid.v4();
      user = new User({
              first: newUser.first,
              last: newUser.last,
              email: newUser.username,
              gender: newUser.gender,
              hashed_password: newUser.password,
              activation_token: token,
              active: false
          });
      console.log('created profile:' + user);
      user.save(function(err) {
        Mail.sendMail(config.mail.emailAddress,
            newUser.username,
            "Activate Kidnava",
            GetInvitiationMail(newUser.first, token));
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

var  GetInvitiationMail = function(first, token) {
  var jadetemplate = jade.compile(
      fs.readFileSync(Path.join(__dirname,
          '../views/partials/invitation.jade'), 'utf8'));
  var url = "http://" + config.node.host + ":" + config.node.port +
            "/activate/" + token;
  return jadetemplate({ link: url, first: first });
};

exports.verifyToken = function (token, callback) {
  User.findOne({ activation_token: token }, function (err, user) {
    if (err) { callback(false, "Failed query"); }
    if (user) {
      user.active = true;
      // Ignoring error for now.
      user.save(function(err){});
      callback(true);
    } else {
      callback(false);
    }
  });
};
