const passport = require('passport');
const { OAuth2Strategy as GoogleStrategy } = require('passport-google-oauth');
const User = require('../../api/models/user.model');
const config = require('../../config');

passport.use(new GoogleStrategy({
  clientID: config.oAuth.google.clientID,
  clientSecret: config.oAuth.google.clientSecret,
  callbackURL: config.oAuth.google.callbackURL
}, (accessToken, refreshToken, profile, done) => {

  let social = profile;
  social.photo = profile._json.image.url;

  User.loginBySocial('google', social)
    .then(user => done(null, user))
    .catch(err => done(err));

}));