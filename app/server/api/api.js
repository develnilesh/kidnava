var Suggestion = require('../utils/suggestionutil');
var Name = require('../utils/nameutils');
var https = require('https');
var Baby = require('../utils/babyutils');

// Adds a baby to the DB
exports.addBaby = function (req, res) {
  var result = Baby.addBaby(req.user.id, req.body);
  res.json(200);
};

// Adds a names to the database.
exports.addSuggestion = function (req, res) {
  var result = Suggestion.addSuggestion(req.user.id, req.body);
  Suggestion.getAll(req.user.id, function(err, suggestions) {
      res.json(200, suggestions);
  });
};

// TODO: Add functionailty 
exports.getNames = function (req, res) {
  Name.getAll(req.params.prefix, function(err, names) {
      res.json(200, names);
  });
};

// Adds a names to the database.
exports.getContacts = function (req, res) {
  console.log('access token in request' + req.user.access_token);
  var options = {
    host: "www.googleapis.com",
    path: "/plus/v1/people/me/people/visible?access_token=" + req.user.access_token,
    headers: {
        'Content-Type': 'application/json'
    }
  };
  https.get(options, function(response) {
      var output = '';
      var self = this;
        response.on('data', function (chunk) {
            output += chunk;
        });

        response.on('end', function() {
            console.log(output);
            var peopleResponse = JSON.parse(output);
            var list = peopleResponse.items;
	    var peopleList = [];            
            for (var i = 0; i < list.length; ++i) {
		console.log(list[i]);
		var people = {
		    name: list[i].displayName,
		    id: list[i].id,
		    image: list[i].image
		};
		peopleList.push(people);
	    }
            res.send(200, peopleList);
        });
      
  }).on('error', function (err) { 
    console.log(err);
    self.res.send(404, 'Error occured:' + err );
   });
};

exports.getUserInfo = function (req, res) {
  var user = {
    first: req.user.first,
    last: req.user.last,
    picture: req.user.picture,
    email: req.user.email
  };
  res.send(user);
};
