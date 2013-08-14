'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var GENDER = ['unknown', 'male', 'female'];

var NameSchema = new Schema({
  name: { type: String, required: true, lowercase: true, trim: true,
    index: {unique: true } },
  gender: { type: String, required: true, default: 'unknown',
      enum: GENDER },
  meaning: {type: [String] },
  
});

module.exports = mongoose.model('Names', NameSchema);
