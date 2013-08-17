'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var SuggestionSchema = new Schema({
  name: { type: String, required: true, index: {unique: true} },
  name_id: { type: Schema.Types.ObjectId },
  meaning: { type: [String]},
  note: { type: String},
  suggested_by: { type: Schema.Types.ObjectId },
  suggested_for: { type: Schema.Types.ObjectId }
});

module.exports = mongoose.model('Suggestion', SuggestionSchema);
