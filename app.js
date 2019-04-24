const dotenv = require("dotenv").config();
const express = require("express");
const compression = require("compression");
const helmet = require("helmet");
const cors = require("cors");
const app = express();
const request = require("request");
const HttpStatus = require("http-status-codes");
const dataFunctions = require("./dataFunctions.js");
const cityList = require("./city.list.json");
const geocoder = require("geocoder");

const owmKey = process.env.OWM_KEY;
const geoLocationKey = process.env.GEOLOCATION_KEY;
const port = process.env.PORT || 5000;

app.use(cors());
app.use(compression());
app.use(helmet());

app.use(function(req, res, next) {
  console.log("Req URL:", req.url);
  next();
});

app.get("/api/weather/current/:location", (req, res) => {
  request.get(
    `http://api.openweathermap.org/data/2.5/weather?id=${
      req.params.location
    }&units=metric&APPID=${owmKey}`,
    (error, response, body) => {
      if (response && response.statusCode === HttpStatus.OK) {
        const owmData = JSON.parse(body);

        const output = dataFunctions.mapData(owmData);

        return res.json(output);
      }

      if (response && response.statusCode === HttpStatus.NOT_FOUND) {
        return res
          .status(HttpStatus.NOT_FOUND)
          .send(`City not found: ${req.params.location}`);
      }

      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .send("Something went wrong!");
    }
  );
});

app.get("/api/weather/forecast/:location", (req, res) => {
  request.get(
    `http://api.openweathermap.org/data/2.5/forecast?id=${
      req.params.location
    }&units=metric&APPID=${owmKey}`,
    (error, response, body) => {
      if (response && response.statusCode === HttpStatus.OK) {
        const owmData = JSON.parse(body);
        let output = [];

        for (day of owmData.list) {
          output.push(dataFunctions.mapData(day));
        }

        return res.json(output);
      }

      if (response && response.statusCode === HttpStatus.NOT_FOUND) {
        return res
          .status(HttpStatus.NOT_FOUND)
          .send(`City not found: ${req.params.location}`);
      }

      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .send("Something went wrong!");
    }
  );
});

app.get("/api/cities/:query", (req, res) => {
  const search = req.params.query;
  const refinedList = cityList.filter(
    cities => cities.name.toUpperCase().indexOf(search.toUpperCase()) > -1
  );

  // only return first 10 results cause holy crap
  res.json(refinedList.slice(0, 10));
});

app.get("/api/cities/geo/:lat/:lon", (req, res) => {
  const lat = req.params.lat;
  const lon = req.params.lon;

  geocoder.reverseGeocode(
    lat,
    lon,
    function(err, data) {
      let locality = data.results[0].address_components.filter(r =>
        r.types.includes("locality")
      );
      let country = data.results[0].address_components.filter(r =>
        r.types.includes("country")
      );

      const cityIdList = cityList.filter(
        cities =>
          cities.name
            .toUpperCase()
            .indexOf(locality[0].short_name.toUpperCase()) > -1 &&
          cities.country
            .toUpperCase()
            .indexOf(country[0].short_name.toUpperCase()) > -1 &&
          Math.floor(Number(cities.coord.lat)) === Math.floor(Number(lat)) &&
          Math.floor(Number(cities.coord.lon)) === Math.floor(Number(lon))
      );

      let response = {
        id: cityIdList[0].id,
        city: cityIdList[0].name,
        country: cityIdList[0].country
      };

      res.json(response);
    },
    { key: geoLocationKey }
  );
});

app.get("/*", (req, res) => {
  res.status(HttpStatus.BAD_REQUEST).send("Invalid request");
});

app.listen(port, () => console.log(`Listening on port ${port}...`));
