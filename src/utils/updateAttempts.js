const updateAttempts = async (id, wrong_attempts, Game) => {
  let linha = await Game.findByPk(id);
  if (linha) {
    linha.wrong_attempts = wrong_attempts;
    await linha.save();
  }
};
module.exports = updateAttempts;
