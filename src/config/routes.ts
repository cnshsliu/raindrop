"use strict";
const GeneralRoutes = require("../routes/general/endpoints");
//Restricted route to prove authentication & authorization
//const RestrictedRoutes = require("../routes/restricted/endpoints");
//const AccountRoutes = require("../routes/account/endpoints");
//const EngineRoutes = require("../routes/engine/endpoints");

const Routes = {
  //Concatentate the routes into one array
  //set the routes for the server
  init: async function (server) {
    await server.route(
      [].concat(
        //DelegationRoutes.endpoints,
        GeneralRoutes.endpoints
        //RestrictedRoutes.endpoints,
        //AccountRoutes.endpoints,
        //EngineRoutes.endpoints,
      )
    );
  },
};

export default Routes;
