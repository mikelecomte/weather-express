module.exports = {
  mapData: function(owmData) {
    return {
      day: owmData.dt,
      id: owmData.weather[0].id,
      weather: owmData.weather[0].main,
      weatherDesc: owmData.weather[0].description,
      icon: owmData.weather[0].icon,
      temp: Math.round(owmData.main.temp),
      humidity: owmData.main.humidity,
      pressure: owmData.main.pressure,
      windSpeed: owmData.wind.speed,
      rain:
        owmData.rain && owmData.rain["3h"]
          ? Math.round(owmData.rain["3h"])
          : null,
      snow:
        owmData.snow && owmData.snow["3h"]
          ? Math.round(owmData.snow["3h"])
          : null
    };
  }
};
