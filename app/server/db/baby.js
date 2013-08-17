'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var GENDER = ['secret', 'male', 'female'];

var BabySchema = new Schema({
  _id: { type: Schema.Types.ObjectId },
  gender: { type: String, required: true, default: 'secret', enum: GENDER },
  parents:{ type: [Schema.Types.ObjectId], required: true}},
  guardians:{ type: [Schema.Types.ObjectId] }
});

module.exports = mongoose.model('Baby', BabySchema);
