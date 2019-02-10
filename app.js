const express = require('express');
const app = express();
const request = require('request');
const HttpStatus = require('http-status-codes');

const owmKey = '7e48a63137c1d244bb76c280ad6f9f1d';
const port = process.env.port || 3000;

app.use(function(req, res, next) {
  console.log('Time:', Date.now());
  console.log('Req URL:', req.url);
  next();
});

app.get('/api/weather/current/:location', (req, res) => {
  request.get(
    `http://api.openweathermap.org/data/2.5/weather?q=${req.params.location}&units=metric&APPID=${owmKey}`,
    (error, response, body) => {
      console.log('Res status code:', response.statusCode);

      if (response.statusCode === HttpStatus.NOT_FOUND) {
        return res.status(HttpStatus.NOT_FOUND).send(`City not found: ${req.params.location}`);
      }

      if (response.statusCode !== HttpStatus.OK) {
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send('Something went wrong!');
      }

      res.status(HttpStatus.OK).json(body);
    }
  );
});

app.get('/*', (req, res) => {
  res.status(400).send('Invalid request');
});

app.listen(port, () => console.log(`Listening on port ${port}...`));
