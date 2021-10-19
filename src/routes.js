const express = require("express");
const routes = express.Router();
const gameController = require("./controllers/game.controller");

routes.get("/", gameController.index);

module.exports = routes;
