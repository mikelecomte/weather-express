const dotenv = require("dotenv").config();
const express = require("express");
const compression = require("compression");
const helmet = require("helmet");
const cors = require("cors");
const app = express();
const got = require("got");
const HttpStatus = require("http-status-codes");
const sphereKnn = require("sphere-knn");

const dataFunctions = require("./dataFunctions.js");
const cityList = require("./city.list.json");

const owmKey = process.env.OWM_KEY;
const port = process.env.PORT || 5000;

const coordinateArray = [];

for (let i = 0; i < cityList.length; i++) {
  coordinateArray.push(cityList[i].coord);
}

const lookup = sphereKnn(coordinateArray);

app.use(cors());
app.use(compression());
app.use(helmet());

app.use(function (req, res, next) {
  console.log("Req URL:", req.url);
  next();
});

app.get("/api/weather/current/:location", async (req, res) => {
  try {
    const response = await got(
      `http://api.openweathermap.org/data/2.5/weather?id=${req.params.location}&units=metric&APPID=${owmKey}`
    );

    if (response && response.statusCode === HttpStatus.OK) {
      const owmData = JSON.parse(response.body);

      const city = cityList.find(
        (cities) => cities.id === Number(req.params.location)
      );

      const output = dataFunctions.mapData(
        owmData,
        city.coord.lat,
        city.coord.lon
      );

      return res.json(output);
    }
  } catch (error) {
    console.log(error.response.body);

    if (error.response && error.response.statusCode === HttpStatus.NOT_FOUND) {
      return res
        .status(HttpStatus.NOT_FOUND)
        .send(`City not found: ${req.params.location}`);
    }

    return res
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .send("Something went wrong!");
  }
});

app.get("/api/weather/forecast/:location", async (req, res) => {
  try {
    const response = await got(
      `http://api.openweathermap.org/data/2.5/forecast?id=${req.params.location}&units=metric&APPID=${owmKey}`
    );

    if (response && response.statusCode === HttpStatus.OK) {
      const owmData = JSON.parse(response.body);

      const city = cityList.find(
        (cities) => cities.id === Number(req.params.location)
      );

      let output = [];

      for (day of owmData.list) {
        output.push(dataFunctions.mapData(day, city.coord.lat, city.coord.lon));
      }

      return res.json(output);
    }
  } catch (error) {
    console.log(error.response.body);

    if (error.response && error.response.statusCode === HttpStatus.NOT_FOUND) {
      return res
        .status(HttpStatus.NOT_FOUND)
        .send(`City not found: ${req.params.location}`);
    }

    return res
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .send("Something went wrong!");
  }
});

app.get("/api/cities/:query", (req, res) => {
  const search = req.params.query;
  const refinedList = cityList.filter(
    (cities) => cities.name.toUpperCase().indexOf(search.toUpperCase()) > -1
  );

  // only return first 10 results cause holy crap
  res.json(refinedList.slice(0, 10));
});

app.get("/api/cities/geo/:lat/:lon", (req, res) => {
  const lat = req.params.lat;
  const lon = req.params.lon;

  const closestCoords = lookup(lat, lon, 1)[0];

  const closestLocationInfo = cityList.find(
    (cities) =>
      cities.coord.lat === closestCoords.lat &&
      cities.coord.lon === closestCoords.lon
  );

  const response = {
    id: closestLocationInfo.id,
    city: closestLocationInfo.name,
    country: closestLocationInfo.country,
  };

  res.json(response);
});

app.get("/*", (req, res) => {
  res.status(HttpStatus.BAD_REQUEST).send("Invalid request");
});

app.listen(port, () => console.log(`Listening on port ${port}...`));
