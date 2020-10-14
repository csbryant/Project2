$(document).ready(() => {
  console.log("HI");
  // This file just does a GET request to figure out which user is logged in
  // and updates the HTML on the page
  $.get("/api/user_data").then(data => {
    console.log("Let it Be");
    $(".member-name").text(data.email);
  });

  $.get("/api/googleapi").then(data => {
    console.log("Help");
    console.log(data);
  });

  $.post("/api/votes").then(data => {
    console.log(data);
  });
});
