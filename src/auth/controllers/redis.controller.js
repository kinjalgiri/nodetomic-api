const { result, error } = require('express-easy-helper');
const { call } = require('../../lib/redis-jwt');

/* Administrator */

// Get section
export function section(req, res) {

  return call.getInfo(req.params.section).then(info => {
    res.send(info.toString());
  }).catch(error(res))

}