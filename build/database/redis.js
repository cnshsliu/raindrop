"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const redis_1 = __importDefault(require("redis"));
const raindrop_keep_secret_1 = __importDefault(require("../../secret/raindrop_keep_secret"));
/**
 *
 * ## The connect string for the OpenShift env
 *
 */
const connection_string = raindrop_keep_secret_1.default.redis;
//running locally - make sure you've started redis server
const redisClient = redis_1.default.createClient(connection_string);
//redisClient.auth(process.env.REDIS_DB_PASSWORD);
exports.default = redisClient;
//# sourceMappingURL=redis.js.map