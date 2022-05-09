"use strict";
import { createClient } from "redis";
import RaindropConfig from "../secret/keep_secret";

const redisClient = createClient({
  url: RaindropConfig.redis.connectionString,
});

redisClient.on("error", (err) => {
  console.log("Redis Client Error", err);
});

export default redisClient;
