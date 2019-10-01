const passport = require('passport');
const { Strategy as LocalStrategy } = require('passport-local');
const User = require('../../api/models/user.model');

passport.use('local', new LocalStrategy({
  usernameField: 'username',
  passwordField: 'password',
  //passReqToCallback: true
}, function (username, password, done) {

  User.loginByLocal(username, password)
    .then(user => done(null, user))
    .catch(err => done(err));

}));