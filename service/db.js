class Database {
  #db = {};

  getDB() {
    return this.#db;
  }

  setKey(key, val) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        this.getDB()[key] = val;
        console.log(this.getDB());
        resolve(Object.keys(this.getDB()).length);
      }, 10);
    });
  }

  setKeys(keys) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        for (const el of keys) {
          const { key, val } = el;
          this.getDB()[key] = val;
        }
        console.log(this.getDB());
        resolve(Object.keys(this.getDB()).length);
      }, 10 + keys.length * 5);
    });
  }

  getKey(key) {
    return this.getDB()[key] || null;
  }
}

const dbInstance = new Database();
// dbInstance.setKey("pl", 100).then((v) => console.log("done", v));

// dbInstance
//   .setKeys([
//     { key: "pp", val: 100 },
//     { key: "opp", val: 100 },
//   ])
//   .then((v) => console.log("done", v));

module.exports = dbInstance;
