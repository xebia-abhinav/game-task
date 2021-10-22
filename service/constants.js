const constants = {};

function defineConstant(key, value) {
  Object.defineProperty(constants, key, {
    value,
    writable: false,
  });
}

defineConstant("status", {
  waiting: "WAITING",
  inProgress: "IN-PROGRESS",
  end: "ENDED",
});

module.exports = constants;
