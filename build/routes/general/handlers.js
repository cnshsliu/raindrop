/**
 * # general/handlers.js
 *
 * Simple display of status and the environment we're running in
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
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * ## Declaration
 *
 */
const internals = {
    index: function (req, h) {
        return __awaiter(this, void 0, void 0, function* () {
            //src/docs/home.md is a markdown file
            return h.view("README.md");
        });
    },
    /**
     * ## status - are we alive?
     *
     */
    status: function (req, h) {
        return __awaiter(this, void 0, void 0, function* () {
            return { status: "ok" };
        });
    },
    /**
     * ## env - display the environment variables available
     *
     */
    env: function (req, h) {
        return __awaiter(this, void 0, void 0, function* () {
            var content = "Node Version: " + process.version + "\n<br/>\n" + "Env: {<br/>\n<pre>";
            //  Add env entries.
            for (var k in process.env) {
                content += "   " + k + ": " + process.env[k] + "\n";
            }
            content += "}\n</pre><br/>\n";
            return ("<html>\n" +
                "  <head><title>Node.js Process Env</title></head>\n" +
                "  <body>\n<br/>\n" +
                content +
                "</body>\n</html>");
        });
    },
};
exports.default = internals;
//# sourceMappingURL=handlers.js.map