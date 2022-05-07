import { isMainThread } from "worker_threads";
/*jshint node: true */
("use strict");

/**
 * ## Imports
 *
 */
//use mongoose as the ORM
import Mongoose, { ConnectOptions } from "mongoose";
import RaindropConfig from "../../secret/raindrop_keep_secret";

/**
 * ## Default the connection string to the development envionment
 *
 */
let connection_string = RaindropConfig.mongodb.connectionString;

/**
 * ## Set the connection string for the OpenShift environment
 *
 */
if (process.env.OPENSHIFT_MONGODB_DB_HOST) {
  connection_string =
    process.env.OPENSHIFT_MONGODB_DB_USERNAME +
    ":" +
    process.env.OPENSHIFT_MONGODB_DB_PASSWORD +
    "@" +
    process.env.OPENSHIFT_MONGODB_DB_HOST +
    ":" +
    process.env.OPENSHIFT_MONGODB_DB_PORT +
    "/" +
    process.env.OPENSHIFT_APP_NAME;
}

Mongoose.connection
  .on(
    "open",
    console.info.bind(
      console,
      "\t" + ((isMainThread ? "MainThread" : "ChildThread") + "  Database open")
    )
  )
  .on(
    "close",
    console.info.bind(
      console,
      "\t" + ((isMainThread ? "MainThread" : "ChildThread") + " Database close")
    )
  );

const dbConnect = () => {
  Mongoose.connect(connection_string, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    maxPoolSize: isMainThread ? 100 : 1,
  } as ConnectOptions);
};
//Mongoose.set("useCreateIndex", true);
//Mongoose.set("useFindAndModify", false);
//
export { Mongoose, dbConnect };
