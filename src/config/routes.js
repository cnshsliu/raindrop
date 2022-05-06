/*jslint node: true */
/**
 * # routes.js
 *
 * All the routes available are defined here
 * The endpoints descripe the method (POST/GET...)
 * and the url ('account/login')
 * and the handler
 *
 *
 */
"use strict";
/**
 * ## All the routes are joined
 *
 */

// Accounts
//const DelegationRoutes = require("../routes/delegation/endpoints");
//General like env & status
const GeneralRoutes = require("../routes/general/endpoints");
//Restricted route to prove authentication & authorization
//const RestrictedRoutes = require("../routes/restricted/endpoints");
//const AccountRoutes = require("../routes/account/endpoints");
//const EngineRoutes = require("../routes/engine/endpoints");
const XhwTraining0506_Routes = require("../routes/xhwtrn0506/endpoints");

var internals = {};

//Concatentate the routes into one array
internals.routes = [].concat(
  //DelegationRoutes.endpoints,
  GeneralRoutes.endpoints,
  //RestrictedRoutes.endpoints,
  //AccountRoutes.endpoints,
  //EngineRoutes.endpoints,
  XhwTraining0506_Routes.endpoints
);

//set the routes for the server
internals.init = async function (server) {
  await server.route(internals.routes);
};

module.exports = internals;
