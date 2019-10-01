const passport = require('passport');
const { initialize } = require('../services/session.service');

// Init passport
export function index(req, res, next) {
  passport.authenticate('github')(req, res, next);
}

// Callback passport
export function callback(req, res, next) {
  passport.authenticate('github', (err, user) => initialize(err, user, res))(req, res, next);
}