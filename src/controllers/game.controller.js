const { Sequelize } = require("sequelize");
const { Game } = require("../app/models");
const axios = require("axios");
const { Player } = require("../app/models");

const authAxios = axios.create({
  baseURL: "https://api.chat2desk.com/v1/",
  headers: {
    Authorization: "68f16f805396b39fe1b88914fa97db",
    "Content-Type": "application/json",
  },
});

async function update_partial_word(id, partial_word, Game) {
  let linha = await Game.findByPk(id);
  linha.partial_word = partial_word;
  await linha.save();
}

async function update_attempts(id, wrong_attempts, Game) {
  let linha = await Game.findByPk(id);
  linha.wrong_attempts = wrong_attempts;
  await linha.save();
}

module.exports = {
  registerNewWord: async (req, res) => {
    const { theme, word } = req.body;
    const response = await Game.create({ theme, word });
    return res.status(201).json(response);
  },

  startGame: async (request, response) => {
    const findGame = await Game.findOne({
      order: Sequelize.literal("random()"),
    });
    const quantityLetters = findGame.word.length;

    try {
      const result = await authAxios.post(
        `clients?phone=${request.body.phone}&transport=widget&nickname=${request.body.name}`,
        { phone: request.body.phone, name: request.body.name }
      );
      const { id, assigned_name, phone } = result.data.data;
      return response.status(201).json({
        user_id: id,
        assigned_name,
        phone,
        game_id: findGame.id,
        theme: findGame.theme,
        quantityLetters,
      });
    } catch (error) {
      console.log("Este error: ", error);
      return response.status(500);
    }
  },

  checkLetter: async (req, res) => {
    let isGameOver = false;
    const { id, letter, user_id } = req.body;
    const game = await Game.findByPk(id);
    if (game) {
      let { word, partial_word, wrong_attempts } = game;
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

      if (noMatchesFound) wrong_attempts++;
      partial_word = partial_word.join("");

      update_partial_word(id, partial_word, Game);

      update_attempts(id, wrong_attempts, Game);

      if (arrayOfMatchedLetters.join("") == word) {
        update_partial_word(id, null, Game);
        isGameOver = true;

        update_attempts(id, 0, Game);
      }

      if (wrong_attempts >= 7) {
        update_partial_word(id, null, Game);
        update_attempts(id, 0, Game);
      }

      if (!(arrayOfMatchedLetters.length == 0)) {
        let message;
        if (isGameOver) {
          message = "Ganhou";
          await authAxios.post(
            `messages?client_id=${user_id}&text=${message}&transport=widget`,
            { user_id, message }
          );
        } else if (wrong_attempts >= 7) {
          message = "Perdeu";
          await authAxios.post(
            `messages?client_id=${user_id}&text=${message}&transport=widget`,
            { user_id, message }
          );
        } else if (noMatchesFound) {
          message = "Letra não encontrada";
        } else {
        }
        return res.status(200).json({
          matchedLetters: arrayOfMatchedLetters,
          message,
        });
      }

      return res.status(404).json({ message: "Letter not found" });
    } else {
      return res.status(404).json({ message: "Game not found" });
    }
  },
};
