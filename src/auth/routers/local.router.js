const controller = require('./../controllers/local.controller');

export default (app) => {
    app.post('/auth/local', controller.callback);
}
