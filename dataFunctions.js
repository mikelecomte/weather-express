module.exports = {
  mapData: function(owmData) {
    return {
      day: owmData.dt,
      weather: owmData.weather[0].main,
      weatherDesc: owmData.weather[0].description,
      icon: owmData.weather[0].icon,
      temp: owmData.main.temp,
      humidity: owmData.main.humidity,
      pressure: owmData.main.pressure,
      windSpeed: owmData.wind.speed,
      rain: owmData.rain && owmData.rain["3h"] ? owmData.rain["3h"] : null,
      snow: owmData.snow && owmData.snow["3h"] ? owmData.snow["3h"] : null
    };
  }
};
