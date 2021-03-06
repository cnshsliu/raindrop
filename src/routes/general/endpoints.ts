/**
 * # general/endpoints.js
 *
 * This supports a status and env request
 *
 */
"use strict";
/**
 * ## Imports
 *
 */
import Joi from "joi";
import Handlers from "./handlers";
/**
 * ## endpoints
 *
 * both are simple gets
 */
let internals = {
  endpoints: [
    {
      method: "GET",
      path: "/",
      handler: Handlers.index,
      config: {
        description: "Get the default/home template.",
        notes: "Renders the /docs/home.md file as HTML.",
        tags: ["api"],
      },
    },
    {
      method: "GET",
      path: "/server/status",
      handler: Handlers.status,
      config: {
        description: "Show the status.",
        notes: "renders json if server is running",
        tags: ["api"],
      },
    },
    {
      method: "GET",
      path: "/server/env",
      handler: Handlers.env,
      config: {
        description: "Show the environment variables.",
        notes: "Renders the variables known to the server",
        tags: ["api"],
      },
    },
    {
      method: "POST",
      path: "/testwhauth",
      handler: Handlers.TestWishhouseAuth,
      config: {
        description: "Test WishHouse Authentication",
        tags: ["api"],
        auth: "wh",
        validate: {
          headers: Joi.object({
            Authorization: Joi.string(),
          }).unknown(),
          validator: Joi,
        },
      },
    },
  ],
};

export default internals;
