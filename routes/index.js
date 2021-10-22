var express = require("express");
var router = express.Router();
const db = require("../service/db");
const generator = require("../service/idGenerator");

router.post("/startGame", async (req, res, handleError) => {
  const { num, bot } = req.body;
  const gameId = generator.genGameId();

  const gameExists = await db.getKey(gameId);
  if (gameExists) return handleError({ error: "Game exists" });

  const ppl = [generator.genPlayerId(1)];
  let next = "";

  if (bot.p2) {
    ppl.push(generator.genPlayerId(2));
    next = ppl[1];
  }
  try {
    await db.setKey(gameId, { ppl, num, next });
  } catch (err) {
    return handleError({ error: "Error starting game: " + err.toString() });
  }

  res.json({
    gameId,
    playerId: ppl[0],
  });
});

router.post("/join", async (req, res, handleError) => {
  const { game } = req.body;
  const gameData = await db.getKey(game);

  if (!gameData)
    return handleError({ error: "Error joining game. Game Id incoorect." });

  if (gameData.ppl.length === parseInt(process.env.MAX_PLAYER_COUNT))
    return handleError({ error: "Error joining game. Game limit full." });

  const playerId = generator.genPlayerId(gameData.ppl.length);
  const ppl = [...gameData.ppl, playerId];

  try {
    await db.setKey(game, { ...gameData, ppl });
  } catch (err) {
    return handleError({ error: "Error joining game: " + err.toString() });
  }

  res.json({
    gameId: game,
    playerId,
  });
});

router.post("/play", async (req, res, handleError) => {
  const { game } = req.body;
  const gameData = await db.getKey(game);

  if (!gameData)
    return handleError({ error: "Error joining game. Game Id incoorect." });

  if (gameData.ppl.length === parseInt(process.env.MAX_PLAYER_COUNT))
    return handleError({ error: "Error joining game. Game limit full." });

  const playerId = generator.genPlayerId(gameData.ppl.length);
  const ppl = [...gameData.ppl, playerId];

  try {
    await db.setKey(game, { ...gameData, ppl });
  } catch (err) {
    return handleError({ error: "Error joining game: " + err.toString() });
  }

  res.json({
    gameId: game,
    playerId,
  });
});

module.exports = router;
