var express = require("express");
var router = express.Router();
const db = require("../service/db");
const generator = require("../service/idGenerator");
const { status } = require("../service/constants");

router.post("/startGame", async (req, res, handleError) => {
  const { num, bot } = req.body;
  const gameId = generator.genGameId();

  const gameExists = await db.getKey(gameId);
  if (gameExists) return handleError({ error: "Game exists" });

  let playStatus = status.waiting;
  const ppl = [generator.genPlayerId(1)];
  let next = "";

  if (bot.p2) {
    ppl.push(generator.genPlayerId(2));
    playStatus = status.inProgress;
    next = ppl[1];
  }
  try {
    await db.setKey(gameId, { ppl, num, next, status: playStatus });
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

  if (!gameData || gameData.status === status.end)
    return handleError({ error: "Error joining game. Game Id incorrect." });

  if (gameData.ppl.length === parseInt(process.env.MAX_PLAYER_COUNT))
    return handleError({ error: "Error joining game. Game limit full." });

  const playerId = generator.genPlayerId(gameData.ppl.length);
  const ppl = [...gameData.ppl, playerId];

  try {
    await db.setKey(game, {
      ...gameData,
      ppl,
      next: playerId,
      status: status.inProgress,
    });
  } catch (err) {
    return handleError({ error: "Error joining game: " + err.toString() });
  }

  res.json({
    gameId: game,
    playerId,
  });
});

router.post("/play", async (req, res, handleError) => {
  const { game, player, choice } = req.body;
  const gameData = await db.getKey(game);

  if (!gameData)
    return handleError({ error: "Error playing game. Game Id incorrect." });
  if (gameData.next !== player)
    return handleError({ error: "Unauthorized player." });
  if (gameData.status === status.end)
    return res.json({ status: "ENDED", winner: gameData.winner });

  const newNum = Math.floor((gameData.num + choice) / 3);
  // HANDLE WIN
  if (newNum === 1) {
    let newGameState = {
      ...gameData,
      next: "",
      status: status.end,
      winner: player,
      num: newNum,
    };
    try {
      await db.setKey(game, newGameState);
    } catch (error) {
      return handleError({
        error: "Unable to update game state. " + error.toString(),
      });
    }
    return res.json({ choice, num: newNum, status: "YOU WIN" });
  }
  let newGameState = {
    ...gameData,
    next: gameData.ppl[gameData.ppl.indexOf(player) + 1] || gameData.ppl[0],
    status: status.inProgress,
    num: newNum,
  };
  try {
    await db.setKey(game, newGameState);
  } catch (error) {
    return handleError({
      error: "Unable to update game state. " + error.toString(),
    });
  }
  return res.json({ choice, num: newNum, status: status.inProgress });
});

router.get("/stat/:game", async (req, res, handleError) => {
  const { game } = req.params;
  const gameData = await db.getKey(game);

  if (!gameData)
    return handleError({ error: "Error fetching game. Game Id incorrect." });
  const { ppl, next, ...safeGameData } = gameData;

  return res.json(safeGameData);
});

module.exports = router;
