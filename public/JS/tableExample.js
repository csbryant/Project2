// This code is for rendering all measures by location.
var measures = [];
const address = "1431+Walnut+Ave+Long+beach+CA+90813";
const queryU =
  "https://api.wevoteusa.org/apis/v1/voterAddressSave/?csrfmiddlewaretoken=mRyhv4vjUAzkGQMWxLZrswUw7BUG6NHe6ojzNTMqHzcWMOVR7vrbYtQvaQZ96m2v&voter_device_id=AE08n1yZqrtkFWv7jO9BeYESRiGQgQoYBfZ9TUxvnfnU0YANSl5NtZVyPGsFrKtXS0zmceW77e6ByyvKm2ky3p5F&text_for_map_search=" +
  address;
// begin first ajax call
$.ajax({
  method: "GET",
  url: queryU,
}).then(function(response) {
  const main = response.ballot_item_list.filter(function(MEASURE) {
    return MEASURE.kind_of_ballot_item === "MEASURE";
  });
  for (var index = 0; index < main.length; index++) {
    const element = main[index];
    measures.push(element);
  }
  render(measures);
});
function render(measures) {
  console.log(measures);
}

// takes in name of user input city
// begin nested ajax calls. Get lat and long of user input city ---> Search query using the searchQ/lat/long/searchRadius/ ---> call Maps API
function getProps(address) {
  const address = "1431+Walnut+Ave+Long+beach+CA+90813";
  const queryU =
    "https://api.wevoteusa.org/apis/v1/voterAddressSave/?csrfmiddlewaretoken=mRyhv4vjUAzkGQMWxLZrswUw7BUG6NHe6ojzNTMqHzcWMOVR7vrbYtQvaQZ96m2v&voter_device_id=AE08n1yZqrtkFWv7jO9BeYESRiGQgQoYBfZ9TUxvnfnU0YANSl5NtZVyPGsFrKtXS0zmceW77e6ByyvKm2ky3p5F&text_for_map_search=" +
    address;
  // begin first ajax call
  $.ajax({
    method: "GET",
    url: queryU,
    success: function(response) {
      displayName = response.ballot_item_list.filter(function(MEASURE) {
        return MEASURE.kind_of_ballot_item === "MEASURE";
      });
      console.log(displayName.ballot_item_display_name);
      console.log(displayName.measure_text);
      console.log(displayName.yes_vote_description);
      console.log(displayName.no_vote_description);

      mainCityLat = response.location_suggestions[0].latitude;
      mainCityLong = response.location_suggestions[0].longitude;
      // search Q  is dynamic depending on customized settings
      // update queryU for our next Zomato API "search" call
      queryU =
        "https://developers.zomato.com/api/v2.1/search?q=" +
        searchQ +
        "&lat=" +
        mainCityLat +
        "&lon=" +
        mainCityLong +
        "&radius=" +
        searchRadius;
      $.ajax({
        headers: {
          Accept: "text/plain; charset=utf-8",
          "Content-Type": "text/plain; charset=utf-8",
          "user-key": "2f0db10ea057aa7670716496e756f590",
        },
        method: "GET",
        url: queryU,
        success: function(response) {
          // randomize the 20 results, and spit out an array carrying the desired amount of bars
          var randomResArray = getRandomRestaurants(response.restaurants);
          // iPlus represents id to match in home.html
          var iPlus;
          // show cards depending on how many bars selected
          if (barHopNumber == 3) {
            $("#row4").hide();
            $("#row5").hide();
          } else if (barHopNumber == 4) {
            $("#row5").hide();
            $("#row4").show();
          } else {
            $("#row4").show();
            $("#row5").show();
          }
          // dynamically write onto the cards the restaurant info
          for (var i = 0; i < randomResArray.length; i++) {
            // hold this particular restaurant info in this iteration
            var thisRestaurant = randomResArray[i].restaurant;
            var name = thisRestaurant.name;
            var cost = thisRestaurant.average_cost_for_two;
            var description = thisRestaurant.highlights;
            var address = thisRestaurant.location.address;
            var phone = thisRestaurant.phone_numbers;
            iPlus = i + 1;
            // Populates cards with restaurant information
            $("#title" + iPlus).text(name);
            $("#address" + iPlus).text("Address: " + address);
            $("#price" + iPlus).text("Average cost for two: $" + cost);
            $("#phone" + iPlus).text("Phone Number: " + phone);
            $("#desc" + iPlus).text(
              "Highlights: " +
                description[0] +
                ", " +
                description[1] +
                ", " +
                description[2]
            );
          }
          // count how many bars there are and run distance/midpoint/routingURL calculations based on that
          howManyBars(randomResArray);
          var customZoom;
          // change zoom according to how far away the endpoints are from each other
          if (totalDistanceInKm < 1.5) {
            customZoom = 15;
          } else if (totalDistanceInKm < 3) {
            customZoom = 14;
          } else if (totalDistanceInKm < 5) {
            customZoom = 13;
          } else if (totalDistanceInKm < 11) {
            customZoom = 12;
          } else if (totalDistanceInKm < 14) {
            customZoom = 11;
          } else {
            customZoom = 10;
          }
          // creating map tile
          var map = new mapboxgl.Map({
            container: "my-map",
            center: midpoint,
            zoom: customZoom,
            style: `https://maps.geoapify.com/v1/styles/osm-bright/style.json?apiKey=${mapAPIKey}`,
          });
          // adding zoom buttons
          map.addControl(new mapboxgl.NavigationControl());
          // when the map loads, execute...
          map.on("load", function() {
            $.ajax({
              method: "GET",
              url: routingURL,
              success: function(result) {
                // begin route drawing
                map.addSource("route", {
                  type: "geojson",
                  data: result,
                });
                // add the drawing
                map.addLayer({
                  id: "route",
                  type: "line",
                  source: "route",
                  layout: {
                    "line-join": "round",
                    "line-cap": "round",
                  },
                  paint: {
                    "line-color": "#4DDBFF",
                    "line-width": 7,
                  },
                });
                // Script for loading geojson bar markers
                var pointgeojson = { type: "FeatureCollection", features: [] };
                for (var i = 0; i < randomResArray.length; i++) {
                  addPoint = {
                    type: "Feature",
                    geometry: {
                      type: "Point",
                      coordinates: [
                        randomResArray[i].restaurant.location.longitude,
                        randomResArray[i].restaurant.location.latitude,
                      ],
                    },
                    properties: {
                      title: randomResArray[i].restaurant.name,
                      description: randomResArray[i].restaurant.timings,
                    },
                  };
                  pointgeojson.features.push(addPoint);
                }
                // load the markers
                map.loadImage(
                  "https://api.geoapify.com/v1/icon/?type=awesome&color=%23467cda&icon=glass-martini&apiKey=85e9d3f13d3845e0a0ca48b327bba8c4",
                  function(error, image) {
                    if (error) throw error;
                    map.addImage("custom-marker", image);
                    map.addSource("waypoints", {
                      type: "geojson",
                      data: pointgeojson,
                    });
                    map.addLayer({
                      id: "waypoints",
                      type: "symbol",
                      source: "waypoints",
                      layout: {
                        "icon-image": "custom-marker",
                        // get the title name from the source's "title" property
                        "text-field": ["get", "title"],
                        "text-font": [
                          "Open Sans Semibold",
                          "Arial Unicode MS Bold",
                        ],
                        "text-offset": [0, 1.25],
                        "text-anchor": "top",
                      },
                    });
                  }
                );
              },
            });
          });
        },
      });
    },
  });
}
