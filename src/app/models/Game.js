module.exports = (sequelize, DataTypes) => {
  const Game = sequelize.define("Game", {
    theme: DataTypes.STRING,
    word: DataTypes.STRING,
    partial_word: DataTypes.STRING,
    wrong_attempts: DataTypes.INTEGER,
  });
  return Game;
};
