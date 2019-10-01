const passport = require('passport');
const { initialize } = require('../services/session.service');

// Init passport
export function index(req, res, next) {
  passport.authenticate('bitbucket')(req, res, next);
}

// Callback passport
export function callback(req, res, next) {
  passport.authenticate('bitbucket', (err, user) => initialize(err, user, res))(req, res, next);
}