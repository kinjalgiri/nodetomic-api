const passport = require('passport');
const { Strategy } = require('passport-bitbucket').BitbucketStrategy;
const User = require('../../api/models/user.model');
const config = require('../../config');

passport.use(new BitbucketStrategy({
  consumerKey: config.oAuth.bitbucket.clientID,
  consumerSecret: config.oAuth.bitbucket.clientSecret,
  callbackURL: config.oAuth.bitbucket.callbackURL
}, (token, tokenSecret, profile, done) => {

  let social = profile;
  social.email = profile._json.email;
  social.photo = profile._json.links.avatar.href;

  User.loginBySocial('bitbucket', social)
    .then(user => done(null, user))
    .catch(err => done(err));

}));