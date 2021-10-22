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

    const { id, word } = response;
    return res.status(200).json({ id, word });
  },
};
