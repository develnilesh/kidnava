'use strict';

var Baby = require('../db/baby');

exports.addBaby = function(userId, babyData) {
/*  var suggestion = new Suggestion({
    name: suggestionData.name,
    note: suggestionData.note,
    suggestedBy: userId
  });

  var failed = false;
  suggestion.save(function(err) {
    failed = true;
  });
  return failed;
*/
return true;
};

exports.getAll = function(userId, callback) {
/*  var getRecords = function(err, docs) {
    var allSuggestion = [];
    if (!err) {
      for (var i = 0; i < docs.length; ++i) {
        allSuggestion.push(docs[i].name);
      }
    }
    callback(err, allSuggestion);
  }
  Suggestion.find({}, 'name', getRecords);
*/
}
