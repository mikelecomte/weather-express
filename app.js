const dotenv = require("dotenv").config();
const express = require("express");
const compression = require("compression");
const cors = require("cors");
const app = express();
const request = require("request");
const HttpStatus = require("http-status-codes");
const dataFunctions = require("./dataFunctions.js");

const owmKey = process.env.OWM_KEY;
const port = process.env.PORT || 5000;

app.use(cors());
app.use(compression());

app.use(function(req, res, next) {
  console.log("Req URL:", req.url);
  next();
});

app.get("/api/weather/current/:location", (req, res) => {
  request.get(
    `http://api.openweathermap.org/data/2.5/weather?q=${
      req.params.location
    }&units=metric&APPID=${owmKey}`,
    (error, response, body) => {
      if (response.statusCode === HttpStatus.NOT_FOUND) {
        return res
          .status(HttpStatus.NOT_FOUND)
          .send(`City not found: ${req.params.location}`);
      }

      if (response.statusCode !== HttpStatus.OK) {
        return res
          .status(HttpStatus.INTERNAL_SERVER_ERROR)
          .send("Something went wrong!");
      }

      const owmData = JSON.parse(body);

      const output = dataFunctions.mapData(owmData);

      res.json(output);
    }
  );
});

app.get("/api/weather/forecast/:location", (req, res) => {
  request.get(
    `http://api.openweathermap.org/data/2.5/forecast?q=${
      req.params.location
    }&units=metric&APPID=${owmKey}`,
    (error, response, body) => {
      if (response.statusCode === HttpStatus.NOT_FOUND) {
        return res
          .status(HttpStatus.NOT_FOUND)
          .send(`City not found: ${req.params.location}`);
      }

      if (response.statusCode !== HttpStatus.OK) {
        return res
          .status(HttpStatus.INTERNAL_SERVER_ERROR)
          .send("Something went wrong!");
      }

      const owmData = JSON.parse(body);
      let output = [];

      for (day of owmData.list) {
        output.push(dataFunctions.mapData(day));
      }

      res.json(output);
    }
  );
});

app.get("/*", (req, res) => {
  res.status(HttpStatus.BAD_REQUEST).send("Invalid request");
});

app.listen(port, () => console.log(`Listening on port ${port}...`));
