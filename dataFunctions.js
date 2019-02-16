module.exports = {
  mapData: function(owmData) {
    return {
      day: owmData.dt,
      weather: owmData.weather[0].main,
      weatherDesc: owmData.weather[0].description,
      temp: owmData.main.temp,
      humidity: owmData.main.humidity,
      pressure: owmData.main.pressure,
      windSpeed: owmData.wind.speed
    };
  }
};
