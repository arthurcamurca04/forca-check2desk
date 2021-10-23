const { Sequelize } = require("sequelize");
const { Game } = require("../app/models");

module.exports = {
  registerNewWord: async (req, res) => {
    const { theme, word } = req.body;
    const wordLowCase = word.toLowerCase();
    const response = await Game.create({ theme, word: wordLowCase });
    return res.status(201).json(response);
  },

  startGame: async (req, res) => {
    const response = await Game.findOne({
      order: Sequelize.literal("random()"),
    });

    const { id, theme } = response;
    return res.status(200).json({ id, theme });
  },

  checkLetter: async (req, res) => {
    const { id, letter } = req.body;
    const game = await Game.findByPk(id);
    if (game) {
      const { word } = game;
      const indexOfLetter = word.indexOf(letter.toLowerCase());

      if (indexOfLetter !== -1) {
        return res.status(200).json(indexOfLetter);
      }
      return res.status(404).json({ message: "Letter not found" });
    } else {
      return res.status(404).json({ message: "Game not found" });
    }
  },
};
