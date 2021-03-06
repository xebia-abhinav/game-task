var createError = require("http-errors");
var express = require("express");

var routes = require("./routes");

var app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/", routes);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};
  res.status(err.status || 500);
  res.send(err);
});

module.exports = app;
