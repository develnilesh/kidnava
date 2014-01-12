'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var GENDER = ['unknown', 'male', 'female'];

// var exports = module.exports = mongoose.model('Role', roleSchema);

var UserSchema = new Schema({
  email: { type: String, required: true, lowercase: true, trim: true,
    index: { unique: true } },
  first:{ type: String, required: true, trim: true },
  last:{ type: String, required: true, trim: true },
  hashed_password: { type: String },
  gender: { type: String, default: 'unknown',
    enum: GENDER },
  parent_to: { type: [Schema.Types.ObjectId] },
  guardian_to: { type: [Schema.Types.ObjectId] },
  active: { type: Boolean, default: false },
  google: {},
  facebook: {},
  access_token: { type: String },
  refresh_token: { type: String }
});

UserSchema.virtual('id')
    .get(function() {
      return this._id.toHexString();
});

module.exports = mongoose.model('User', UserSchema);
