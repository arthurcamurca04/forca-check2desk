module.exports = (sequelize, DataTypes) => {
  const Game = sequelize.define("Game", {
    theme: DataTypes.STRING,
    word: DataTypes.STRING,
    partial_word: DataTypes.STRING,
    attempts: DataTypes.INTEGER,
  });
  return Game;
};
