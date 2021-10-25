const updatePartialWord = async (id, partial_word, Game) => {
  let linha = await Game.findByPk(id);
  if (linha) {
    linha.partial_word = partial_word;
    await linha.save();
  }
};

module.exports = updatePartialWord;
