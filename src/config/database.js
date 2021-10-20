module.exports = {
  host: "localhost",
  username: "postgres",
  password: "docker",
  database: "db",
  dialect: "postgres",
  operatorsAliases: false,
  logging: false,
  define: {
    timestamps: true,
    underscored: true,
    underscoredAll: true,
  },
};
