// user model
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

var express = require('express');

var User = new Schema({
  username:  {type: String, unique: true},
  password: String,
  won:[Date],
  availability: {type: Number, default: 0}
});

User.plugin(passportLocalMongoose);
var passport = require('passport');

module.exports = mongoose.model('users', User);

