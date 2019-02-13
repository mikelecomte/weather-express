const dotenv = require("dotenv").config();
const express = require("express");
const app = express();
const request = require("request");
const HttpStatus = require("http-status-codes");
const moment = require("moment");

const owmKey = process.env.OWM_KEY;
const port = process.env.port || 3000;

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
      console.log("Res code:", response.statusCode);

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

      const output = {
        day: moment(owmData.dt * 1000).format("MMMM Do YYYY, h:mm:ss a"),
        weather: owmData.weather[0].main,
        weatherDesc: owmData.weather[0].description,
        temp: owmData.main.temp,
        humidity: owmData.main.humidity,
        pressure: owmData.main.pressure,
        windSpeed: owmData.wind.speed
      };

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
      console.log("Res code:", response.statusCode);

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
        output.push({
          day: moment(day.dt * 1000).format("MMMM Do YYYY, h:mm:ss a"),
          weather: day.weather[0].main,
          weatherDesc: day.weather[0].description,
          temp: day.main.temp,
          humidity: day.main.humidity,
          pressure: day.main.pressure,
          windSpeed: day.wind.speed
        });
      }

      res.json(output);
    }
  );
});

app.get("/*", (req, res) => {
  res.status(HttpStatus.BAD_REQUEST).send("Invalid request");
});

app.listen(port, () => console.log(`Listening on port ${port}...`));
