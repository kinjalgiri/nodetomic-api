const { result, invalid, error } = require('express-easy-helper');
const { calc, time } = require('role-calc');
const { r } = require('../../lib/redis-jwt');
const config = require('../../config');

// Initialize after login success
export async function initialize(err, user, res) {

  try {
    // Errors
    if (err)
      return invalid(res, { message: err });
    if (!user)
      return error(res, { message: 'Something went wrong, please try again.' });

    // Calculate ttl by user roles, by default takes the role with the longest 'max'
    let ttl = calc(time(config.roles, user.roles), 'max');

    // Create session in redis-jwt
    const token = await r.sign(user._id.toString(), {
      ttl,
      dataSession: {// save data in REDIS (Private)
        ip: res.req.headers['x-forwarded-for'] || res.req.connection.remoteAddress,
        agent: res.req.headers['user-agent']
      },
      dataToken: {// save data in Token (Public)
        example: 'I travel with the token!'
      }
    });

    // Save token in cookies
    res.cookie('token', JSON.stringify(token));

    // if local return token
    if (user.provider === 'local')
      return result(res, { token });

    // if Social redirect to..
    res.redirect(`/?token=${token}`);

  } catch (err) {
    return error(res, { message: err });
  }

}