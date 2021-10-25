const { Sequelize } = require("sequelize");
const { Game } = require("../app/models");
const authAxios = require("../utils/axios");
const updatePartialWord = require("../utils/updatePartialWord");
const updateAttempts = require("../utils/updateAttempts");

module.exports = {
  registerNewGame: async (req, res) => {
    const { theme, word } = req.body;
    if (theme == "" || word == "") {
      return res.status(400).json({ message: "Campos vazios" });
    }
    try {
      const result = await Game.create({ theme, word });
      return res.status(201).json(result);
    } catch (error) {
      return res.status(400).json({ message: "Campos vazios" });
    }
  },

  startGame: async (request, response) => {
    const requestBodyName = request.body.name;
    const requestBodyPhone = request.body.phone;

    if (!requestBodyName || !requestBodyPhone) {
      return response.status(400).json({ message: "Campos não informados" });
    }
    if (requestBodyName == "" || requestBodyPhone == "") {
      return response.status(400).json({ message: "Campos vazios" });
    }
    try {
      const findGame = await Game.findOne({
        order: Sequelize.literal("random()"),
      });
      const quantityLetters = findGame.word.length;
      const result = await authAxios.post(
        `clients?phone=${requestBodyPhone}&transport=widget&nickname=${requestBodyName}`,
        { phone: requestBodyPhone, name: requestBodyName }
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
      return response.status(400).json({ message: "Algo errado" });
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

      updatePartialWord(id, partial_word, Game);

      updateAttempts(id, wrong_attempts, Game);

      if (arrayOfMatchedLetters.join("") == word) {
        updatePartialWord(id, null, Game);
        isGameOver = true;

        updateAttempts(id, 0, Game);
      }

      if (wrong_attempts >= 7) {
        updatePartialWord(id, null, Game);
        updateAttempts(id, 0, Game);
      }

      if (!(arrayOfMatchedLetters.length == 0)) {
        let message;
        if (isGameOver == true) {
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
    } else {
      return res.status(404).json({ message: "Game not found" });
    }
  },
};
