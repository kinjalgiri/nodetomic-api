const passport = require('passport');
const { initialize } = require('../services/session.service');

// Callback passport
export function callback(req, res, next) {
  passport.authenticate('local', (err, user) => initialize(err, user, res))(req, res, next);
}