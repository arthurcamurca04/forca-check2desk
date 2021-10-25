const axios = require("axios");

const authAxios = axios.create({
  baseURL: "https://api.chat2desk.com/v1/",
  headers: {
    Authorization: "68f16f805396b39fe1b88914fa97db",
    "Content-Type": "application/json",
  },
});

module.exports = authAxios;
