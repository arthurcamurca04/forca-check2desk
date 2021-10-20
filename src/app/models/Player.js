module.exports = (sequelize, DataTypes) => {
  const Player = sequelize.define("Player", {
    name: DataTypes.STRING,
    phone: DataTypes.STRING,
  });
  return Player;
};
