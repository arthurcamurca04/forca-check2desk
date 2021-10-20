module.exports = {
  host: "localhost",
  username: "postgres",
  password: "docker",
  database: "postgres",
  dialect: "postgres",
  operatorsAliases: false,
  logging: false,
  define: {
    timestamps: true,
    underscored: true,
    underscoredAll: true,
  },
};
