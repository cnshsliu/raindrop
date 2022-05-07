/**
 * # general/endpoints.js
 *
 * This supports a status and env request
 *
 */
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.endpoints = void 0;
/**
 * ## Imports
 *
 */
const handlers_1 = __importDefault(require("./handlers"));
/**
 * ## endpoints
 *
 * both are simple gets
 */
exports.endpoints = [
    {
        method: "GET",
        path: "/",
        handler: handlers_1.default.index,
        config: {
            description: "Get the default/home template.",
            notes: "Renders the /docs/home.md file as HTML.",
            tags: ["api"],
        },
    },
    {
        method: "GET",
        path: "/server/status",
        handler: handlers_1.default.status,
        config: {
            description: "Show the status.",
            notes: "renders json if server is running",
            tags: ["api"],
        },
    },
    {
        method: "GET",
        path: "/server/env",
        handler: handlers_1.default.env,
        config: {
            description: "Show the environment variables.",
            notes: "Renders the variables known to the server",
            tags: ["api"],
        },
    },
];
//# sourceMappingURL=endpoints.js.map