const express = require("express");
const router = express.Router();
const sphereKnn = require("sphere-knn");
const cityList = require("../city.list.json");

const coordinateArray = [];

for (let i = 0; i < cityList.length; i++) {
  coordinateArray.push(cityList[i].coord);
}

const lookup = sphereKnn(coordinateArray);

router.get("/api/cities/:query", (req, res) => {
  const search = req.params.query;
  const refinedList = cityList.filter(
    (cities) => cities.name.toUpperCase().indexOf(search.toUpperCase()) > -1
  );

  // only return first 10 results cause holy crap
  res.json(refinedList.slice(0, 10));
});

router.get("/api/cities/geo/:lat/:lon", (req, res) => {
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

module.exports = router;
