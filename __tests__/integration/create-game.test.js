const { Game } = require("../../src/app/models");
describe("create game", () => {
  it("should create a new game", async () => {
    const game = await Game.create({ theme: "Animais", word: "Leão" });
    console.log(game);
    expect(game.word).toBe("Leão");
  });
});
