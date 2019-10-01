const passport = require('passport');
const { initialize } = require('../services/session.service');

// Init passport
export function index(req, res, next) {
  passport.authenticate('twitter')(req, res, next);
}

// Callback passport
export function callback(req, res, next) {
  passport.authenticate('twitter', (err, user) => initialize(err, user, res))(req, res, next);
}