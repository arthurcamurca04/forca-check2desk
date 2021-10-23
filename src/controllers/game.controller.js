const { Sequelize } = require("sequelize");
const { Game } = require("../app/models");

module.exports = {
  registerNewWord: async (req, res) => {
    const { theme, word } = req.body;
    const response = await Game.create({ theme, word });
    return res.status(201).json(response);
  },

  startGame: async (req, res) => {
    const response = await Game.findOne({
      order: Sequelize.literal("random()"),
    });

    const { id, theme, word } = response;
    const quantityLetters = word.length;
    return res.status(200).json({ id, theme, quantityLetters });
  },

  checkLetter: async (req, res) => {
    const { id, letter } = req.body;
    const game = await Game.findByPk(id);
    if (game) {
      const { word } = game;
      const indexesOfLetter = [];
      Array.from(word).forEach((wordLetter, index) => {
        if (letter.toLowerCase() == wordLetter.toLowerCase()) {
          indexesOfLetter.push(index);
        }
      });
      if (!(indexesOfLetter.length == 0)) {
        return res.status(200).json(indexesOfLetter);
      }
      return res.status(404).json({ message: "Letter not found" });
    } else {
      return res.status(404).json({ message: "Game not found" });
    }
  },
};
