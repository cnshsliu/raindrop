/**
 * # views.js
 *
 * Snowflake has only one view, reset password
 *
 * Using the module 'vision, establish the renderering engine,
 * in this case, handlebars, and where the views are located
 *
 * Since this reset password view needs a javascript file,
 * the location of this 'asset' is set.
 *
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
const hoek_1 = __importDefault(require("@hapi/hoek"));
const inert_1 = __importDefault(require("@hapi/inert"));
const marked_1 = __importDefault(require("marked"));
const path_1 = __importDefault(require("path"));
const vision_1 = __importDefault(require("@hapi/vision"));
const handlebars_1 = __importDefault(require("handlebars"));
/**
 * ### markdown view
 *
 * Use the GitHub Markdown css
 */
/**
 * ## init
 *
 */
const Views = {
    init: function (server) {
        return __awaiter(this, void 0, void 0, function* () {
            /**
             * ### vision
             *
             * this establishes where the html is located
             * and the engine to parse it
             */
            yield server
                .register({
                plugin: vision_1.default,
            })
                .then(() => {
                server.views({
                    engines: {
                        html: handlebars_1.default,
                        md: {
                            module: {
                                compile: function (template) {
                                    return function (context) {
                                        var html = marked_1.default.marked(template, context);
                                        return `<link rel="stylesheet" href="/assets/github-markdown.css">
<style>
    .markdown-body {
        box-sizing: border-box;
        min-width: 200px;
        max-width: 980px;
        margin: 0 auto;
        padding: 45px;
    }
</style>
<article class="markdown-body">
    ${html}
</article>`;
                                    };
                                },
                            },
                            contentType: "text/html",
                        },
                    },
                    relativeTo: __dirname,
                    path: [path_1.default.join(__dirname, "../views"), path_1.default.join(__dirname, "../docs")],
                });
            })
                .catch((err) => {
                hoek_1.default.assert(!err, err);
            });
            /**
             * ### inert
             *
             * this says that any request for /assest/* will
             * be served from the ../assests dir
             *
             * The resetpassword.js is located in ../assests
             *
             */
            yield server
                .register({
                plugin: inert_1.default,
            })
                .then(() => {
                //Load files located in ../assets
                server.route({
                    method: "GET",
                    path: "/assets/{param*}",
                    handler: {
                        directory: {
                            path: path_1.default.join(__dirname, "../assets"),
                        },
                    },
                });
            })
                .catch((err) => {
                //Confirm no err
                hoek_1.default.assert(!err, err);
            });
        });
    },
};
exports.default = Views;
//# sourceMappingURL=views.js.map