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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * ## Imports
 *
 */
const raindrop_keep_secret_1 = __importDefault(require("../../secret/raindrop_keep_secret"));
//the authentication package
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const redis_1 = __importDefault(require("../database/redis"));
//mongoose user object
const User_1 = __importDefault(require("../database/models/User"));
// private key for signing
const JwtAuth = {
    privateKey: raindrop_keep_secret_1.default.crypto.privateKey,
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
    validate: function (decoded, request, h) {
        return __awaiter(this, void 0, void 0, function* () {
            //POST方式，在headers中放了 authorization
            let authorization = request.headers.authorization;
            if (!authorization) {
                //GET方式，在访问URL后面要加 ?token=${session.user.sessionToken}
                authorization = request.query["token"];
            }
            //does redis have the token
            let inblack = redis_1.default.get(authorization);
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
            let user = yield User_1.default.findById(decoded.id).populate("tenant", { _id: 1, name: 1, owner: 1 });
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
            }
            else {
                result = {
                    isValid: false,
                    credentials: undefined,
                };
            }
            return result;
        });
    },
    // create token
    createToken: function (obj) {
        return jsonwebtoken_1.default.sign(obj, JwtAuth.privateKey);
    },
    verify: function (tk, options, callback) {
        let id = options.id;
        let expirein = options.expirein;
        return jsonwebtoken_1.default.verify(tk, JwtAuth.privateKey);
    },
    // set jwt auth strategy
    setJwtStrategy: function (server) {
        return __awaiter(this, void 0, void 0, function* () {
            server.auth.strategy("token", "jwt", {
                key: JwtAuth.privateKey,
                validate: JwtAuth.validate,
            });
        });
    },
};
exports.default = JwtAuth;
//# sourceMappingURL=jwt-strategy.js.map