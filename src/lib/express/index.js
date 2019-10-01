const helmet = require('helmet');
const bodyParser = require('body-parser');
const compression = require('compression');
const methodOverride = require('method-override');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const session = require('express-session');
const cors = require('cors');
const morgan = require('morgan');
const config = require('../../config');

export function index(app) {

  return new Promise((resolve, reject) => {

    app.use(bodyParser.json({ limit: '5mb' }));
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(cookieParser());
    app.use(methodOverride());
    app.use(compression());
    app.use(helmet());
    app.use(cors({ origin: true, credentials: true }));

	/*
    if ("twitter" in config.oAuth && config.oAuth.twitter.enabled)
      app.use(session({ secret: config.secret, resave: false, saveUninitialized: false }));
	*/
    app.use(passport.initialize());
    app.use(passport.session());

    // Morgan
    if (config.log)
      app.use(morgan('dev'));

    resolve();

  })

};
