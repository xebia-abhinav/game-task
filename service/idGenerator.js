const genPlayerId = (n) => Date.now() + Math.floor(n * Math.random());

const genGameId = () => Date.now() - 29867;

module.exports = {
  genGameId,
  genPlayerId,
};
