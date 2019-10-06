const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const User = require('../models/user');


var passport = require('passport')

passport.use('local', new LocalStrategy( {
  usernameField: 'email',
  passwordField: 'password'
},
  function(name, password, done) {
    User.findOne({ email: name }, function (err, user) {
      if (err) { return done(err); }
      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }
      if (!user.isValid(password)) {
        return done(null, false, { message: 'Incorrect password.' });
      }
      return done(null, user);
    });
  }
));

passport.serializeUser(function(user, done) {
  done(null, user._id);
    });
       passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
       done(err, user);
    });
});