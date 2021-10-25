const { Game } = require("../../src/app/models");
const truncate = require("../utils/trucante");

describe("create game", () => {
  beforeEach(async () => {
    await truncate();
  });

  it("should create a new game", async () => {
    const game = await Game.create({ theme: "Animais", word: "Leão" });
    expect(game.word).toBe("Leão");
  });
});
