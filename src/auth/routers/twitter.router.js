const controller = require('./../controllers/twitter.controller');

export default (app) => {
    app.get('/auth/twitter', controller.index);
    app.get('/auth/twitter/callback', controller.callback);
}
