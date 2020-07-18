const express = require("express");
const router = express.Router();
const cityList = require("../city.list.json");
const got = require("got");
const HttpStatus = require("http-status-codes");
const dataFunctions = require("../dataFunctions.js");
const owmKey = process.env.OWM_KEY;

router.get("/api/weather/current/:location", async (req, res) => {
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

module.exports = router;
