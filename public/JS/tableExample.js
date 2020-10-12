// This code is for rendering all measures by location.
var measures = [];
const address = "1431+Walnut+Ave+Long+beach+CA+90813";
const queryU =
  "https://api.wevoteusa.org/apis/v1/voterAddressSave/?csrfmiddlewaretoken=mRyhv4vjUAzkGQMWxLZrswUw7BUG6NHe6ojzNTMqHzcWMOVR7vrbYtQvaQZ96m2v&voter_device_id=AE08n1yZqrtkFWv7jO9BeYESRiGQgQoYBfZ9TUxvnfnU0YANSl5NtZVyPGsFrKtXS0zmceW77e6ByyvKm2ky3p5F&text_for_map_search=" +
  address;
// begin first ajax call
$.ajax({
  method: "GET",
  url: queryU
}).then(function(response) {
  const main = response.ballot_item_list.filter(function(MEASURE) {
    return MEASURE.kind_of_ballot_item === "MEASURE";
  });
  for (var index = 0; index < main.length; index++) {
    const element = main[index];
    measures.push(element);
  }

  measures.forEach(render);

  /*   for (var index = 0; index < measures.length; index++) {
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
  } */
});

function render(measures) {
  //Render card title
  var propositionCards = $("#propositionscards");
  var carddiv = $("<div>").addClass("card text-center");
  propositionCards.append(carddiv);
  var cardheaderdiv = $("<div>").addClass("card-header");
  carddiv.append(cardheaderdiv);
  cardheaderdiv.text(measures.ballot_item_display_name);

  //Render cardbody
  var cardbodydiv = $("<div>").addClass("card-body");
  carddiv.append(cardbodydiv);
  var bodypelement = $("<p>").addClass("card-text");
  cardbodydiv.append(bodypelement);
  bodypelement.text(measures.measure_text);

  //Render Yes Body
  var yesdiv = $("<div>").addClass("col-sm noyes");
  cardbodydiv.append(yesdiv);
  yesdiv.text(measures.yes_vote_description);

  //Render No Body
  var nodiv = $("<div>").addClass("col-sm noyes");
  cardbodydiv.append(nodiv);
  nodiv.text(measures.no_vote_description);

  //Render Card Footer
  var cardfooterdiv = $("<div>").addClass("card-footer");
  carddiv.append(cardfooterdiv);
  var btnddiv = $("<div>")
    .addClass("btn-group btn-group-toggle propvote")
    .attr("data-toggle", "buttons");
  cardfooterdiv.append(btnddiv);

  //Render Yes Button
  var labelyes = $("<label>").addClass("btn btn-secondary");
  btnddiv.append(labelyes);
  labelyes.text("Yes");
  var inputyes = $(
    "<input type='radio' name='options' id ='option1' autocomplete='off' checked>"
  );
  labelyes.append(inputyes);

  //Render Undecided Button
  var labelundecided = $("<label>").addClass("btn btn-secondary active");
  btnddiv.append(labelundecided);
  labelundecided.text("Undecided");
  var inputundecided = $(
    "<input type='radio' name='options' id ='option2' autocomplete='off'>"
  );
  labelundecided.append(inputundecided);

  //Render No Button
  var labelno = $("<label>").addClass("btn btn-secondary");
  btnddiv.append(labelno);
  labelno.text("No");
  var inputno = $(
    "<input type='radio' name='options' id ='option3' autocomplete='off'>"
  );
  labelno.append(inputno);
}
