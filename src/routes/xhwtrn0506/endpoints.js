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
var Handlers = require("./handlers"),
  internals = {};
/**
 * ## endpoints
 *
 * both are simple gets
 */
internals.endpoints = [
  {
    method: "POST",
    path: "/echo",
    handler: Handlers.EchoPost,
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
    handler: Handlers.CommentAddForBiz,
    config: {
      description: "Add Comment for biz object (such as TODO)",
      tags: ["api"],
      //auth: "token",
      validate: {
        //headers: Joi.object({ Authorization: Joi.string(), }).unknown(),
        payload: {
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
    handler: Handlers.CommentReplyForComment,
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
    handler: Handlers.CommentDelete,
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
    handler: Handlers.CommentThumb,
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
];

module.exports = internals;
