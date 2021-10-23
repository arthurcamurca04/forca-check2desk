const express = require("express");
const routes = express.Router();
const gameController = require("./controllers/game.controller");

routes.post("/create/word", gameController.registerNewWord);
routes.post("/check/letter", gameController.checkLetter);
routes.get("/start/game", gameController.startGame);

module.exports = routes;
