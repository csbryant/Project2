// This code is for rendering all measures and cadidate by location.

$(document).ready(() => {
  //Getting Users Address
  const addressInput = $("#address-input");
  const addressBtn = $("#address-btn");

  addressBtn.click("submit", event => {
    event.preventDefault();
    const inputAddress = addressInput.val().trim();
    console.log(inputAddress);
  });

  //Array to push local measures
  var measures = [];
  var presedentialCandidates = [];

  const address = "1431+Walnut+Ave+Long+beach+CA+90813";
  const queryU =
    "https://api.wevoteusa.org/apis/v1/voterAddressSave/?csrfmiddlewaretoken=mRyhv4vjUAzkGQMWxLZrswUw7BUG6NHe6ojzNTMqHzcWMOVR7vrbYtQvaQZ96m2v&voter_device_id=AE08n1yZqrtkFWv7jO9BeYESRiGQgQoYBfZ9TUxvnfnU0YANSl5NtZVyPGsFrKtXS0zmceW77e6ByyvKm2ky3p5F&text_for_map_search=" +
    address;

  // begin first ajax call
  $.ajax({
    method: "GET",
    url: queryU
  }).then(function(response) {
    const measuresdata = response.ballot_item_list.filter(function(MEASURE) {
      return MEASURE.kind_of_ballot_item === "MEASURE";
    });

    const federaldata = response.ballot_item_list.filter(function(federal) {
      return federal.race_office_level === "Federal";
    });

    for (var index = 0; index < federaldata[1].candidate_list.length; index++) {
      presedentialCandidates.push(federaldata[1].candidate_list[index]);
    }

    for (var index = 0; index < measuresdata.length; index++) {
      measures.push(measuresdata[index]);
    }
    console.log(presedentialCandidates);
    presedentialCandidates.forEach(renderPresidents);
    measures.forEach(render);
  });

  function renderPresidents(presidents) {
    //Render Card Top
    var presidentcards = $("#presidentcards");
    var carddeck = $("<div>").addClass("card-deck");
    presidentcards.append(carddeck);
    var card = $("<div>").addClass("card");
    carddeck.append(card);
    // Needs Source
    var image = $("<img>").addClass("card-img-top");
    card.append(image);
    image.attr("src", presidents.candidate_photo_url_large);
    // Card Body
    var cardbody = $("<div>").addClass("card-body");
    card.append(cardbody);
    // Needs Candidate
    var cardtitle = $("<h5>").addClass("card-title");
    cardbody.append(cardtitle);
    cardtitle.text(presidents.ballot_item_display_name);
    // Needs Party
    var textmuted = $("<small>").addClass("text-muted");
    cardbody.append(textmuted);
    textmuted.text(presidents.party);
    // Needs Summary
    var cardtext = $("<p>").addClass("card-text");
    cardbody.append(cardtext);
    cardtext.text(presidents.ballotpedia_candidate_summary);

    //Card Footer
    var cardfooter = $("<div>").addClass("card-footer");
    cardbody.append(cardfooter);
    var presbutton = $("<div>")
      .addClass("btn-group btn-group-toggle")
      .attr("data-toggle", "buttons");
    cardfooter.append(presbutton);

    //Render Choose Button
    var labelchoose = $("<label>").addClass("btn btn-secondary");
    presbutton.append(labelchoose);
    labelchoose.text("Choose");
    var inputchoose = $(
      "<input type='radio' name='options' id ='option1' autocomplete='off' checked>"
    );
    labelchoose.append(inputchoose);

    //Render Oppose Button
    var labeloppose = $("<label>").addClass("btn btn-secondary");
    presbutton.append(labeloppose);
    labeloppose.text("Oppose");
    var inputoppose = $(
      "<input type='radio' name='options' id ='option3' autocomplete='off'>"
    );
    labelchoose.append(inputoppose);
  }

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
});
