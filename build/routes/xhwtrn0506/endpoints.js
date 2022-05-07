"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Joi = require("joi");
/**
 * # general/endpoints.js
 *
 * This supports a status and env request
 *
 */
("use strict");
/**
 * ## Imports
 *
 */
const handlers_1 = __importDefault(require("./handlers"));
const internals = {
    /**
     * ## endpoints
     *
     * both are simple gets
     */
    endpoints: [
        {
            method: "POST",
            path: "/echo",
            handler: handlers_1.default.EchoPost,
            config: {
                description: "Echo user post",
                tags: ["api"],
                //auth: "token",
                /* validate: {
                  //headers: Joi.object({ Authorization: Joi.string(), }).unknown(),
                  payload: {
                    objtype: Joi.string().required(),
                    objid: Joi.string().required(),
                    content: Joi.string().required(),
                  },
                  validator: Joi,
                }, */
            },
        },
        {
            method: "POST",
            path: "/comment/addforbiz",
            handler: handlers_1.default.CommentAddForBiz,
            config: {
                description: "Add Comment for biz object (such as TODO)",
                tags: ["api"],
                //auth: "token",
                validate: {
                    //headers: Joi.object({ Authorization: Joi.string(), }).unknown(),
                    payload: {
                        userid: Joi.string().required(),
                        objtype: Joi.string().required(),
                        objid: Joi.string().required(),
                        content: Joi.string().required(),
                    },
                    validator: Joi,
                },
            },
        },
        {
            method: "POST",
            path: "/comment/reply",
            handler: handlers_1.default.CommentReplyForComment,
            config: {
                description: "Reply Comment for comment",
                tags: ["api"],
                //auth: "token",
                validate: {
                    /* headers: Joi.object({
                      Authorization: Joi.string(),
                    }).unknown(), */
                    payload: {
                        cmtid: Joi.string().required(),
                        content: Joi.string().required(),
                        threadid: Joi.string().optional(),
                    },
                    validator: Joi,
                },
            },
        },
        {
            method: "POST",
            path: "/comment/delete",
            handler: handlers_1.default.CommentDelete,
            config: {
                description: "List comments",
                tags: ["api"],
                //auth: "token",
                validate: {
                    /* headers: Joi.object({ Authorization: Joi.string(), }).unknown(), */
                    payload: {
                        commentid: Joi.string().required(),
                    },
                    validator: Joi,
                },
            },
        },
        {
            method: "POST",
            path: "/comment/thumb",
            handler: handlers_1.default.CommentThumb,
            config: {
                description: "Thumb up or Thumb down for Comment",
                tags: ["api"],
                validate: {
                    headers: Joi.object({
                        Authorization: Joi.string(),
                    }).unknown(),
                    payload: {
                        cmtid: Joi.string().required(),
                        thumb: Joi.string().uppercase().valid("UP", "DOWN"),
                    },
                    validator: Joi,
                },
            },
        },
    ],
};
exports.default = internals;
//# sourceMappingURL=endpoints.js.map