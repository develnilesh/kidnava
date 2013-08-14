var Suggestion = require('../utils/suggestionutil');
var Name = require('../utils/nameutils');

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
