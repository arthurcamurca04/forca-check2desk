const request = require("supertest");
const app = require("../../src/app");

describe("Game controller", () => {
  beforeEach(async () => {
    const theme = "Objetos";
    const word = "Cadeira";

    await request(app).post("/create/word").send({ theme, word });
  });
  it("should register a new game", async () => {
    const theme = "Animais";
    const word = "Cachorro";

    const response = await request(app)
      .post("/create/word")
      .send({ theme, word });

    expect(response.status).toBe(201);
    expect(response.body).toEqual({
      id: expect.any(Number),
      theme: expect.any(String),
      word: expect.any(String),
      updatedAt: expect.any(String),
      createdAt: expect.any(String),
    });
  });

  it("should start a new game", async () => {
    const name = "Bat";
    const phone = "55839712345679";

    const response = await request(app)
      .post("/start/game")
      .send({ name, phone });

    expect(response.status).toBe(201);
    expect(response.body).toEqual({
      user_id: expect.any(Number),
      game_id: expect.any(Number),
      theme: expect.any(String),
      phone: expect.any(String),
      assigned_name: expect.any(String),
      quantityLetters: expect.any(Number),
    });
  });
});
