// Requiring our models and passport as we've configured it
const db = require("../models");
const passport = require("../config/passport");

module.exports = function(app) {
  // Using the passport.authenticate middleware with our local strategy.
  // If the user has valid login credentials, send them to the members page.
  // Otherwise the user will be sent an error
  app.post("/api/login", passport.authenticate("local"), (req, res) => {
    // Sending back a password, even a hashed password, isn't a good idea
    res.json({
      email: req.user.email,
      id: req.user.id,
    });
  });

  // Route for signing up a user. The user's password is automatically hashed and stored securely thanks to
  // how we configured our Sequelize User Model. If the user is created successfully, proceed to log the user in,
  // otherwise send back an error
  app.post("/api/signup", (req, res) => {
    db.User.create({
      email: req.body.email,
      password: req.body.password,
    })
      .then(() => {
        res.redirect(307, "/api/login");
      })
      .catch((err) => {
        console.log(err);
        res.status(401).json(err);
      });
  });

  // Route for logging user out
  app.get("/logout", (req, res) => {
    req.logout();
    res.redirect("/");
  });

  // Route for getting some data about our user to be used client side
  app.get("/api/user_data", (req, res) => {
    if (!req.user) {
      // The user is not logged in, send back an empty object
      res.json({});
    } else {
      // Otherwise send back the user's email and id
      // Sending back a password, even a hashed password, isn't a good idea
      res.json({
        email: req.user.email,
        id: req.user.id,
      });
    }
  });

  app.get("/api/candidates", function(req, res) {
    var dbQuery = "SELECT * FROM candidates";

    connection.query(dbQuery, function(err, result) {
      if (err) {
        throw err;
      }
      res.render(result);
    });
  });

  app.get("/api/googleapi", function(req, res) {
    const { google } = require("googleapis");

    const civicinfo = google.civicinfo({
      version: "v2",
      auth: "AIzaSyDsppdMS3wxP88R7QYqvWbyYk7HavF5Y4U",
    });
    const params = {
      address: "1439 Blake Avenue Los Angeles CA 90031",
    };
    // get the civic details
    let info;

    civicinfo.elections
      .voterInfoQuery(params)
      .then((res) => {
        console.log(res.data.dropOffLocations);
        return (info = res.data.dropOffLocations);
      })
      .catch((error) => {
        console.error(error);
      });

    return res.json(info);
  });

  app.get("/api/votes", function(req, res) {
    db.Vote.findAll({})
      .then((data) => {
        res.json(data);
      })
      .catch((err) => {
        console.log(err);
        res.status(401).json(err);
      });
  });
};

/* 
const axios = require("axios");

const { Server } = require("http");
const fs = require("fs");
const middlewaretoken =
  "XGteyaJG5V1j8wA5wgAVQQl3ThYIpe9klfyiFKFQ117KzZnGqvbkMksXfGPqEzhk&";
const voter_device_id =
  "e9d5HVqN5duYmmWNDoonK5zyJ2KZh2CsHhnunVRpSnKlFF4sWdRKLBuOy5rESt1znScUhtcItDAxgk78ca7uQiBc";
const google_civic_election_id = "1000112";
const address = "4053+camellia+ave.+studio+city+california+91604";
app.get("/voteraddress/:address", (req, res) => {
  axios({
    method: "get",
    url:
      "https://api.wevoteusa.org/apis/v1/voterAddressSave/?csrfmiddlewaretoken=" +
      middlewaretoken +
      "voter_device_id=" +
      voter_device_id +
      "&text_for_map_search=" +
      address
  }).then(function(response) {
    console.log(response.data);
  });
});
 */
/* 
const civicinfo = google.civicinfo({
  version: "v2",
  auth: "AIzaSyDsppdMS3wxP88R7QYqvWbyYk7HavF5Y4U"
});
const params = {
  address: "1439 Blake Avenue Los Angeles CA 90031"
};
// get the civic details
civicinfo.elections
  .voterInfoQuery(params)
  .then(res => {
    console.log(res.data.dropOffLocations);
  })
  .catch(error => {
    console.error(error);
  });
axios({
  method: "get",
  url: "https://api.wevoteusa.org/apis/v1/deviceIdGenerate"
}).then(function(response) {
  console.log(response.data);
});
 */
