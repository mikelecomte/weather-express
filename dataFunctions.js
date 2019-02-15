const moment = require("moment");

module.exports = {
  mapData: function(owmData) {
    return {
      day: moment(owmData.dt * 1000).format("MMMM Do YYYY, h:mm:ss a"),
      weather: owmData.weather[0].main,
      weatherDesc: owmData.weather[0].description,
      temp: owmData.main.temp,
      humidity: owmData.main.humidity,
      pressure: owmData.main.pressure,
      windSpeed: owmData.wind.speed
    };
  }
};
