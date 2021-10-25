const request = require("supertest");
const app = require("../../src/app");
const truncate = require("../utils/trucante");

describe("Game controller", () => {
  let id;
  beforeAll(async () => {
    await truncate();
    const theme = "Objetos";
    const word = "Cadeira";

    const result = await request(app)
      .post("/create/word")
      .send({ theme, word });
    id = result.body.id;
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

  it("should not register a new game without setting fields theme and/or word", async () => {
    const response = await request(app).post("/create/word");

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      message: expect.any(String),
    });
  });

  it("should not register a new game when fields theme and/or word are empty", async () => {
    const theme = "";
    const word = "";

    const response = await request(app)
      .post("/create/word")
      .send({ theme, word });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      message: expect.any(String),
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

  it("should not start a new game with empty fields", async () => {
    const name = "";
    const phone = "";

    const response = await request(app)
      .post("/start/game")
      .send({ name, phone });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      message: expect.any(String),
    });
  });

  it("should not start a new game without setting fields name and/or phone ", async () => {
    const response = await request(app).post("/start/game");
    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      message: expect.any(String),
    });
  });

  it("should check for a letter", async () => {
    const game_id = id;
    const user_id = 469084451;
    const letter = "M";

    const response = await request(app)
      .post("/check/letter")
      .send({ game_id, user_id, letter });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      matchedLetters: expect.any(Array),
      message: expect.any(String),
    });
  });

  it("should return 404 when game does not exists", async () => {
    const id = 526;
    const user_id = 469084451;
    const letter = "C";

    const response = await request(app)
      .post("/check/letter")
      .send({ id, user_id, letter });
    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      message: expect.any(String),
    });
  });
});
