module.exports = (sequelize, DataTypes) => {
  const Game = sequelize.define("Game", {
    theme: DataTypes.STRING,
    word: DataTypes.STRING,
  });
  return Game;
};
