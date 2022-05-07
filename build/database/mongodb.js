"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dbConnect = exports.Mongoose = void 0;
const worker_threads_1 = require("worker_threads");
/*jshint node: true */
("use strict");
/**
 * ## Imports
 *
 */
//use mongoose as the ORM
const mongoose_1 = __importDefault(require("mongoose"));
exports.Mongoose = mongoose_1.default;
const raindrop_keep_secret_1 = __importDefault(require("../../secret/raindrop_keep_secret"));
/**
 * ## Default the connection string to the development envionment
 *
 */
let connection_string = raindrop_keep_secret_1.default.mongodb.connectionString;
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
mongoose_1.default.connection
    .on("open", console.info.bind(console, "\t" + ((worker_threads_1.isMainThread ? "MainThread" : "ChildThread") + "  Database open")))
    .on("close", console.info.bind(console, "\t" + ((worker_threads_1.isMainThread ? "MainThread" : "ChildThread") + " Database close")));
const dbConnect = () => {
    mongoose_1.default.connect(connection_string, {
        useUnifiedTopology: true,
        useNewUrlParser: true,
        maxPoolSize: worker_threads_1.isMainThread ? 100 : 1,
    });
};
exports.dbConnect = dbConnect;
//# sourceMappingURL=mongodb.js.map