const controller = require('./../controllers/redis.controller');
const { mw } = require('./../services/mw.service');

export default (app) => {
    app.get('/auth/redis/:section', mw(['admin']), controller.section);
}
