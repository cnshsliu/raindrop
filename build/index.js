/*jshint node: true */
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const hapi_1 = __importDefault(require("./config/hapi"));
const mongodb_1 = require("./database/mongodb");
(0, mongodb_1.dbConnect)();
hapi_1.default.starter();
//# sourceMappingURL=index.js.map