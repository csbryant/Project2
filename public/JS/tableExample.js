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
  //   render(measures);
  for (var index = 0; index < measures.length; index++) {
    const measureTitle = measures[index].ballot_item_display_name;
    const measureDescription = measures[index].measure_text;
    const measureYes = measures[index].yes_vote_description;
    const measureNo = measures[index].no_vote_description;
    iPlus = index + 1;

    $("#title").text(measureTitle);
    $("#description").text(measureDescription);
    $("#yesVote").text(measureYes);
    $("#noVote").text(measureNo);

    console.log(measureTitle);
    console.log(measureDescription);
    console.log(measureYes);
    console.log(measureNo);
  }
});

// function render(measures) {
//   console.log(measures);
// }
