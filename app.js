const express = require("express");
const app = express();
const request = require("request");
const owmKey = '7e48a63137c1d244bb76c280ad6f9f1d';

app.use(express.json());

const port = process.env.port || 3000;

app.get('/api/weather', (req, res) => {
    request.get(`http://api.openweathermap.org/data/2.5/weather?q=Guelph&APPID=${owmKey}`, (error, response, body) => {

    if(error) {
        return res.send(error);
    }

    res.send(JSON.parse(body));
  });
  
});

app.listen(port, () => console.log(`Listening on port ${port}...`));