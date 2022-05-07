/**
 * # ErrorAlert.js
 *
 * This class uses a component which displays the appropriate alert
 * depending on the platform
 *
 * The main purpose here is to determine if there is an error and then
 * plucking off the message depending on the shape of the error object.
 */
"use strict";
/**
 * ## Imports
 *
 */
import RaindropConfig from "../secret/keep_secret";
//the authentication package
import Jwt from "jsonwebtoken";
import redisClient from "../database/redis";
//mongoose user object
import User from "../database/models/User";

// private key for signing
const JwtAuth = {
  privateKey: RaindropConfig.crypto.privateKey,

  /**
   *
   * ## validate
   *
   *  When a route is configured w/ 'auth', this validate function is
   * invoked
   *
   * If the token wasn't invalidated w/ logout, then validate
   * its for a user
   *
   * When a user logs out, the token they were using is saved to Redis
   * and checked here to prevent re-use
   *
   */
  validate: async function (decoded, request, h) {
    //POST方式，在headers中放了 authorization
    let authorization = request.headers.authorization;
    if (!authorization) {
      //GET方式，在访问URL后面要加 ?token=${session.user.sessionToken}
      authorization = request.query["token"];
    }
    //does redis have the token
    let inblack = redisClient.get(authorization);
    //oops - it's been blacklisted - sorry
    if (inblack) {
      console.log("invalid: inblack");
      return {
        isValid: false,
      };
    }
    // ok - valid token, do we have a user?
    // note we're only using 'id' - that's because
    // the user can change their email and username
    let result = { isValid: false, credentials: undefined };
    let user = await User.findById(decoded.id).populate("tenant", { _id: 1, name: 1, owner: 1 });
    if (user) {
      result = {
        isValid: true,
        credentials: {
          _id: user._id,
          username: user.username,
          email: user.email,
          tenant: user.tenant,
        },
      };
    } else {
      result = {
        isValid: false,
        credentials: undefined,
      };
    }
    return result;
  },

  // create token
  createToken: function (obj) {
    return Jwt.sign(obj, JwtAuth.privateKey);
  },
  verify: function (tk, options, callback) {
    let id = options.id;
    let expirein = options.expirein;
    return Jwt.verify(tk, JwtAuth.privateKey);
  },

  // set jwt auth strategy
  setJwtStrategy: async function (server) {
    server.auth.strategy("token", "jwt", {
      key: JwtAuth.privateKey,
      validate: JwtAuth.validate,
    });
  },
};

export default JwtAuth;
