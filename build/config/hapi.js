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
const raindrop_keep_secret_1 = __importDefault(require("../../secret/raindrop_keep_secret"));
const hapi_1 = require("@hapi/hapi");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const jwt_strategy_1 = __importDefault(require("../auth/jwt-strategy"));
const routes_1 = __importDefault(require("./routes"));
const views_1 = __importDefault(require("./views"));
const good_1 = __importDefault(require("@hapi/good"));
const hapi_auth_jwt2_1 = __importDefault(require("hapi-auth-jwt2"));
const basic_1 = __importDefault(require("@hapi/basic"));
//import Inert from "@hapi/inert";
//import Vision from "@hapi/vision";
//import HapiSwagger from "hapi-swagger";
const theHapiServer = {
    server_initialized: false,
    server: new hapi_1.Server({
        port: raindrop_keep_secret_1.default.hapi.port,
        address: raindrop_keep_secret_1.default.hapi.ip,
        routes: {
            //Allow CORS for all
            cors: true,
            validate: {
                failAction: (request, h, err) => {
                    console.error(err);
                    if (request.method === "post") {
                        console.error(request.path, JSON.stringify(request.payload));
                    }
                    throw err;
                },
            },
        },
    }),
    register_Good: () => __awaiter(void 0, void 0, void 0, function* () {
        yield theHapiServer.server.register({
            plugin: good_1.default,
            options: {
                reporters: {
                    myConsoleReporter: [
                        {
                            module: "@hapi/good-squeeze",
                            name: "Squeeze",
                            args: [
                                {
                                    log: "*",
                                    request: ["error", "warn", "debug"],
                                    error: "*",
                                },
                            ],
                        },
                        {
                            module: "@hapi/good-console",
                        },
                        "stdout",
                    ],
                },
            },
        });
    }),
    register_authJwt: () => __awaiter(void 0, void 0, void 0, function* () {
        yield theHapiServer.server.register({ plugin: hapi_auth_jwt2_1.default });
    }),
    register_authBasic: () => __awaiter(void 0, void 0, void 0, function* () {
        yield theHapiServer.server.register({ plugin: basic_1.default });
        theHapiServer.server.auth.strategy("basic", "basic", {
            validate: (request, username, password, h) => __awaiter(void 0, void 0, void 0, function* () {
                let isValid = false;
                let credentials = null;
                if (username === "foo" && password === "bar") {
                    isValid = true;
                    credentials = { username };
                }
                return { isValid, credentials };
            }),
        });
    }),
    /* register_swagger: async () => {
      await theHapiServer.server.register([
        Inert,
        Vision,
        { plugin: HapiSwagger, options: }, {
          info: {
            title: "HyperFlow API Documentation",
            version: "2.0",
          },
        }
      ]);
    }, */
    starter: () => __awaiter(void 0, void 0, void 0, function* () {
        if (theHapiServer.server_initialized) {
            return theHapiServer.server;
        }
        yield theHapiServer.register_Good();
        yield theHapiServer.register_authJwt();
        yield theHapiServer.register_authBasic();
        //await register_swagger();
        yield jwt_strategy_1.default.setJwtStrategy(theHapiServer.server);
        yield routes_1.default.init(theHapiServer.server);
        yield views_1.default.init(theHapiServer.server);
        yield theHapiServer.server.start();
        console.debug("Server is running: " + theHapiServer.server.info.uri);
        theHapiServer.server.events.on("response", function (request) {
            switch (request.method.toUpperCase()) {
                case "POST":
                    break;
                case "GET":
            }
            let user = "Unkown";
            if (request.payload && request.payload.token) {
                let decoded = jsonwebtoken_1.default.verify(request.payload.token, raindrop_keep_secret_1.default.crypto.privateKey);
                user = decoded.email;
            }
            console.debug(`${request.method.toUpperCase()} ${request.path} ${request.response.statusCode} ${request.method.toUpperCase() === "POST" ? JSON.stringify(request.payload) : ""}`);
        });
        theHapiServer.server_initialized = true;
        return theHapiServer.server;
    }),
    init: () => __awaiter(void 0, void 0, void 0, function* () {
        if (theHapiServer.server_initialized) {
            return theHapiServer.server;
        }
        yield theHapiServer.register_Good();
        yield theHapiServer.register_authJwt();
        yield theHapiServer.register_authBasic();
        //await register_swagger();
        yield jwt_strategy_1.default.setJwtStrategy(theHapiServer.server);
        yield views_1.default.init(theHapiServer.server);
        yield routes_1.default.init(theHapiServer.server);
        yield theHapiServer.server.initialize();
        console.debug("Server is initializing: " + theHapiServer.server.info.uri);
        theHapiServer.server_initialized = true;
        return theHapiServer.server;
    }),
};
exports.default = theHapiServer;
//# sourceMappingURL=hapi.js.map