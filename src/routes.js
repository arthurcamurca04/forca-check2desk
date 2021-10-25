const express = require("express");
const routes = express.Router();
const gameController = require("./controllers/game.controller");

routes.post("/create/word", gameController.registerNewGame);
routes.post("/check/letter", gameController.checkLetter);
routes.post("/start/game", gameController.startGame);
module.exports = routes;
