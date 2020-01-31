const request = require("request");

const mapboxRequestParams = [
  "access_token=pk.eyJ1IjoibWdtYXN0ZXIyNCIsImEiOiJjazYweHg0cHYwYXc3M2x0ZDJnYWpvYnhyIn0.JBsMv7IcGAjsEJiiT7fUMA",
  "language=en"
];

const geocode = (location, callback) => {
  const mapboxUrl =
    "https://api.mapbox.com/geocoding/v5/mapbox.places/" +
    encodeURIComponent(location) +
    ".json?" +
    mapboxRequestParams.join("&");
  request(
    {
      url: mapboxUrl,
      json: true
    },
    (err, resp) => {
      if (err) {
        callback("Unable to connect to location services!", undefined);
      } else if (resp.body.features.length === 0) {
        callback(
          "Unable to find location.  Please try another search.",
          undefined
        );
      } else {
        const results = resp.body.features[0];
        callback(undefined, {
          latitude: results.center[1],
          longitude: results.center[0],
          location: results.place_name
        });
      }
    }
  );
};

module.exports = geocode;
