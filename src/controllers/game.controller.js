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
    let isGameOver = false;
    const { id, letter } = req.body;
    const game = await Game.findByPk(id);
    if (game) {
      let { word, partial_word } = game;

      if (!partial_word) {
        partial_word = [];
        Array.from(word).forEach((item) => {
          partial_word.push("-");
        });
      } else {
        partial_word = Array.from(partial_word);
      }
      console.log(partial_word);
      const arrayOfMatchedLetters = [];
      Array.from(word).map(async (wordLetter, index) => {
        if (letter.toLowerCase() == wordLetter.toLowerCase()) {
          arrayOfMatchedLetters.push(letter);
          partial_word[index] = letter;

          partial_word = partial_word.join("");

          const linha = await Game.findByPk(id);
          linha.partial_word = partial_word;
          await linha.save();
        } else if (partial_word[index] == "-") {
          arrayOfMatchedLetters.push(null);
        } else {
          arrayOfMatchedLetters.push(partial_word[index]);
        }
      });
      if (arrayOfMatchedLetters.join("") == word) {
        const linha = await Game.findByPk(id);
        linha.partial_word = null;
        await linha.save();
        isGameOver = true;
      }
      if (!(arrayOfMatchedLetters.length == 0)) {
        return res.status(200).json({
          matchedLetters: arrayOfMatchedLetters,
          finished: isGameOver ? "Congrats" : "Keep Trying",
        });
      }
      return res.status(404).json({ message: "Letter not found" });
    } else {
      return res.status(404).json({ message: "Game not found" });
    }
  },
};
