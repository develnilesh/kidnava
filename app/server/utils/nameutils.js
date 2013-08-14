'use strict';

var Names = require('../db/names');

exports.getAll = function(prefix, callback) {
  var getRecords = function(err, docs) {
    var topNames = [];
    if (!err) {
      for (var i = 0; i < docs.length; ++i) {
        topNames.push(docs[i].name);
      }
    }
    callback(err, topNames);
  }
  console.log('getting names with: ' + prefix);
  Names.find({ name: { $regex: '^' + prefix } }, 'name', getRecords).limit(10);
}

