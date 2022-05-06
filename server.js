/*jshint node: true */
"use strict";
// var starter = require('./src/config/hapi');
const { starter } = require("./src/config/hapi");

/**
 * The mongodb will be used to store all the users
 */
require("./src/database/mongodb");

starter();
