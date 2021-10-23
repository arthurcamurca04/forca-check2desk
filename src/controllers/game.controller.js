const { Sequelize } = require("sequelize");
const { Game } = require("../app/models");
async function update_partial_word(id, partial_word, Game) {
  let linha = await Game.findByPk(id);
  linha.partial_word = partial_word;
  await linha.save();
}

async function update_attempts(id, attempts, Game) {
  let linha = await Game.findByPk(id);
  linha.attempts = attempts;
  await linha.save();
}

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
      let { word, partial_word, attempts } = game;
      if (!partial_word) {
        partial_word = [];
        Array.from(word).forEach((item) => {
          partial_word.push("-");
        });
      } else {
        partial_word = Array.from(partial_word);
      }
      const arrayOfMatchedLetters = [];
      let noMatchesFound = true;
      Array.from(word).map(async (wordLetter, index) => {
        if (letter.toLowerCase() == wordLetter.toLowerCase()) {
          noMatchesFound = false;
          arrayOfMatchedLetters.push(letter);
          partial_word[index] = letter;
        } else if (partial_word[index] == "-") {
          arrayOfMatchedLetters.push(null);
        } else {
          arrayOfMatchedLetters.push(partial_word[index]);
        }
      });

      if (noMatchesFound) attempts++;
      partial_word = partial_word.join("");

      update_partial_word(id, partial_word, Game);

      update_attempts(id, attempts, Game);

      if (arrayOfMatchedLetters.join("") == word) {
        update_partial_word(id, null, Game);
        isGameOver = true;

        update_attempts(id, 0, Game);
      }

      if (attempts >= 7) {
        update_partial_word(id, null, Game);
        update_attempts(id, 0, Game);
      }

      if (!(arrayOfMatchedLetters.length == 0)) {
        return res.status(200).json({
          matchedLetters: arrayOfMatchedLetters,
          message: isGameOver
            ? "Congrats"
            : attempts >= 7
            ? "Perdeu"
            : "Keep Trying",
        });
      }

      return res.status(404).json({ message: "Letter not found" });
    } else {
      return res.status(404).json({ message: "Game not found" });
    }
  },
};
