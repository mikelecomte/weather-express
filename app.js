const express = require("express");
const app = express();
const request = require("request");
const owmKey = "7e48a63137c1d244bb76c280ad6f9f1d";

app.use(function(req, res, next) {
  console.log("Time:", Date.now());
  console.log("Req URL:", req.url);
  next();
});

const port = process.env.port || 3000;

app.get("/api/weather/current/:location", (req, res) => {
  request.get(
    `http://api.openweathermap.org/data/2.5/weather?q=${req.params.location}&units=metric&APPID=${owmKey}`,
    (error, response, body) => {
      if (response.statusCode === 404) {
        return res.status(404).send("City not found");
      }

      res.status(200).json(body);
      console.log("Current weather sent for", req.params.location);
    }
  );
});

app.get("/*", (req, res) => {
  res.status(400).send("Invalid request");
});

app.listen(port, () => console.log(`Listening on port ${port}...`));
