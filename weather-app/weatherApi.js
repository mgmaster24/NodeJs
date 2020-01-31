const request = require("request");
const geocode = require("./utils/geocode");

const getWeather = location => {
  geocode(location, (err, resp) => {
    if (err) {
      console.log(err);
    } else {
      const darkskyRequestParams = ["lang=en", "units=us"];
      const darkskyAccessToken = "f5e77efc6ee0ceb94149e2670a97e2be";
      const darksyUrl =
        "https://api.darksky.net/forecast/" +
        darkskyAccessToken +
        "/" +
        resp.latitude +
        "," +
        resp.longitude +
        "?" +
        darkskyRequestParams.join("&");

      request(
        {
          url: darksyUrl,
          json: true
        },
        (error, response) => {
          if (error) {
            console.log(error);
          } else {
            const currentCoditions = response.body.currently;
            const currentTemp = currentCoditions.temperature;
            const precipitaionProbability = currentCoditions.precipProbability;
            console.log("It is currently " + currentTemp + " degrees out in " + resp.location);
            console.log(
              "There is a " + precipitaionProbability + "% chance of rain"
            );
          }
        }
      );
    }
  });
};

module.exports = {
  getWeather
};
