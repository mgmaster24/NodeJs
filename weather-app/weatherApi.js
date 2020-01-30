const request = require("request");

const mapboxRequestParams = [
  "access_token=pk.eyJ1IjoibWdtYXN0ZXIyNCIsImEiOiJjazYweHg0cHYwYXc3M2x0ZDJnYWpvYnhyIn0.JBsMv7IcGAjsEJiiT7fUMA",
  "language=en"
];

const errorMethod = error => {
  console.log(error);
};

const requestMethod = (url, successCallBack) => {
  request(
    {
      url: url,
      json: true
    },
    (err, resp) => {
      if (err) {
        errorMethod(err);
      } else {
        successCallBack(resp);
      }
    }
  );
};

const geocode = (city, queryParams, callback) => {
  const mapboxUrl =
    "https://api.mapbox.com/geocoding/v5/mapbox.places/" +
    city +
    ".json?" +
    queryParams.join("&");

  requestMethod(mapboxUrl, resp => {
    const features = resp.body.features;
    if (features.length == 0) {
      console.log("No results found for city search criteria.");
      return;
    }

    const mostRelevant = features[0];
    const latAndLong = mostRelevant.center;

    callback(latAndLong);
  });
};

const getWeather = location => {
  geocode(location, mapboxRequestParams, latAndLong => {
    const darkskyRequestParams = ["lang=en", "units=us"];
    const darkskyAccessToken = "f5e77efc6ee0ceb94149e2670a97e2be";
    const darksyUrl =
      "https://api.darksky.net/forecast/" +
      darkskyAccessToken +
      "/" +
      latAndLong.reverse().join(",") +
      "?" +
      darkskyRequestParams.join("&");

    requestMethod(darksyUrl, resp => {
      if (resp.body.code) {
        console.log(resp.error);
        return;
      }

      const currentCoditions = resp.body.currently;
      //const dailyConditions = response.body.daily.data;

      //dailyConditions.forEach(day => {});

      const currentTemp = currentCoditions.temperature;
      const precipitaionProbability = currentCoditions.precipProbability;
      console.log("It is currently " + currentTemp + " degrees out");
      console.log("There is a " + precipitaionProbability + "% chance of rain");
    });
  });
};

module.exports = {
    getWeather
};
