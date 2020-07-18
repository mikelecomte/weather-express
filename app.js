const dotenv = require("dotenv").config();
const express = require("express");
const app = express();
const compression = require("compression");
const helmet = require("helmet");
const cors = require("cors");
const HttpStatus = require("http-status-codes");
const port = process.env.PORT || 5000;
const cityRouter = require("./routes/cities.js");
const currentRouter = require("./routes/current.js");
const forecastRouter = require("./routes/forecast.js");

app.use(cors());
app.use(compression());
app.use(helmet());
app.use(cityRouter);
app.use(currentRouter);
app.use(forecastRouter);

app.use(function (req, res, next) {
  console.log("Req URL:", req.url);
  next();
});

app.get("/*", (req, res) => {
  res.status(HttpStatus.BAD_REQUEST).send("Invalid request");
});

app.listen(port, () => console.log(`Listening on port ${port}...`));
