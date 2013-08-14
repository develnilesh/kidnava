'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var SuggestionSchema = new Schema({
  name: { type: String, required: true, index: {unique: true} },
  note: { type: String},
  suggestedBy: { type: Schema.Types.ObjectId },
  suggestionFor: { type: Schema.Types.ObjectId }
});

module.exports = mongoose.model('Suggestion', SuggestionSchema);
