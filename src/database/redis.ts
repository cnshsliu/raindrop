"use strict";
import Redis from "redis";
import RaindropConfig from "../../secret/raindrop_keep_secret";

/**
 *
 * ## The connect string for the OpenShift env
 *
 */
const connection_string = RaindropConfig.redis;
//running locally - make sure you've started redis server
const redisClient = Redis.createClient(connection_string);
//redisClient.auth(process.env.REDIS_DB_PASSWORD);

export default redisClient;
