const genPlayerId = (n) => Date.now() + Math.floor(n * Math.random());

const genGameId = () => Date.now() - 29867;

const genChoice = () => (Date.now() & 1 ? -1 : 1);

module.exports = {
  genGameId,
  genPlayerId,
  genChoice,
};
