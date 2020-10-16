// This code is for rendering all measures and cadidate by location.

$(document).ready(() => {
  //Getting Users Address
  const addressInput = $("#address-input");
  const addressBtn = $("#address-btn");

  addressBtn.click("submit", event => {
    event.preventDefault();
    const inputAddress = addressInput.val().trim();
    const replacedAddress = inputAddress.split(" ").join("+");
    grabMeasures(replacedAddress);
    grabLocation();
  });
  //End of code to grab Users Address

  //Start grab Presidents function
  grabPresidents();

  //Grab Presidential Candidates from API
  function grabPresidents() {
    const presidentwevoteUrl =
      "https://api.wevoteusa.org/apis/v1/voterBallotItemsRetrieve/?csrfmiddlewaretoken=ncRBy6zydqnBkz9zk2c4rOFh3nrxrLclLLWFFGvI9wt2L2WaehNtniMbpMifG6kl&voter_device_id=e9d5HVqN5duYmmWNDoonK5zyJ2KZh2CsHhnunVRpSnKlFF4sWdRKLBuOy5rESt1znScUhtcItDAxgk78ca7uQiBc&google_civic_election_id=&ballot_returned_we_vote_id=&ballot_location_shortcut=";

    //Presidential Candidate Array
    var presedentialCandidates = [];

    // Presidential Candidate Ajax Call
    $.ajax({
      method: "GET",
      url: presidentwevoteUrl
    }).then(function(res) {
      const federaldata = res.ballot_item_list.filter(function(federal) {
        return federal.race_office_level === "Federal";
      });

      for (
        var index = 0;
        index < federaldata[1].candidate_list.length;
        index++
      ) {
        presedentialCandidates.push(federaldata[1].candidate_list[index]);
      }
      //Start renderPresidents fucntion
      presedentialCandidates.forEach(renderPresidents);
    });
  }
  //End of ajax call for presidents

  //Grab Meaures from API
  function grabMeasures(addressparameter) {
    //Array to push local measures
    var measures = [];

    // Parameters for Ajax call
    const queryU =
      "https://api.wevoteusa.org/apis/v1/voterAddressSave/?csrfmiddlewaretoken=mRyhv4vjUAzkGQMWxLZrswUw7BUG6NHe6ojzNTMqHzcWMOVR7vrbYtQvaQZ96m2v&voter_device_id=AE08n1yZqrtkFWv7jO9BeYESRiGQgQoYBfZ9TUxvnfnU0YANSl5NtZVyPGsFrKtXS0zmceW77e6ByyvKm2ky3p5F&text_for_map_search=" +
      addressparameter;

    // Measure Ajax Call
    $.ajax({
      method: "GET",
      url: queryU
    }).then(function(response) {
      const measuresdata = response.ballot_item_list.filter(function(MEASURE) {
        return MEASURE.kind_of_ballot_item === "MEASURE";
      });

      for (var index = 0; index < measuresdata.length; index++) {
        measures.push(measuresdata[index]);
      }

      measures.forEach(renderMeasures);
    });
  }

  function grabLocation() {
    $.get("/api/googleapi").then(data => {
      const locations = data.slice(0, 5);
      console.log(locations);

      locations.forEach(renderLocations);

      //function to render Locations
    });
  }
  //End of grabbing google api

  // Function to render Presidents
  function renderPresidents(presidents) {
    const presidentcardimagesrc = presidents.candidate_photo_url_large;
    const presidentcardHeader = presidents.ballot_item_display_name;
    const presidentpartytext = presidents.party;
    const presidentcards = $("#presidentcards");
    const presidentid = presidents.id;

    const presidenthtmlSection = `
      <div class="col-6">
      <div class="card">
    <img
      class="card-img-top"
      src= ${presidentcardimagesrc}
      alt="Card image cap"
    />
    <div class="card-body">
      <h5 class="card-title">${presidentcardHeader}</h5>
      <small class="text-muted">${presidentpartytext}</small>
    </div>
    <div class="card-footer">
      <div class="btn-group" role="group" aria-label="choices">
        <button data-id=${presidentid} data-state="true" type="button" class="choicesbtn btn btn-secondary">Choose</button>
        <button data-id=${presidentid} data-state="false" type="button" class="choicesbtn btn btn-secondary">Oppose</button>
       </div>
    </div>
  </div>
</div>
    `;

    presidentcards.append(presidenthtmlSection);
    buttonClick();
  }
  // End of code to render presidents

  //function to render Measures
  function renderMeasures(measures) {
    const measurecardHeader = measures.ballot_item_display_name;
    const measurecardBody = measures.measure_text;
    const measureyesBody = measures.yes_vote_description;
    const measurenoBody = measures.no_vote_description;
    const measureid = measures.local_ballot_order;

    const measureshtmlSection = `
    <div class="card text-center">
    <div class="card-header">
    ${measurecardHeader}
    </div>
    <div class="card-body">
      <p class="card-text">${measurecardBody}</p>
      <div class="col-sm noyes">
        ${measureyesBody}
      </div>
      <div class="col-sm noyes">
      ${measurenoBody}
      </div>
    </div>
    <div class="card-footer">
    <div class="card-footer">
    <div  class=" btn-group" role="group" aria-label="choices">
      <button data-id=${measureid} data-state="true" type="button" class="choicesbtn btn btn-secondary">Choose</button>
      <button data-id=${measureid} data-state="false" type="button" class="choicesbtn btn btn-secondary">Oppose</button>
     </div>
  </div>
  </div>`;

    $("#propositionscards").append(measureshtmlSection);
    buttonClick();
  }
  // End of code to render measures

  //function to render Locations
  function renderLocations(locations) {
    const locName = locations.address.locationName;
    const locStreet = locations.address.line1;
    const locCity = locations.address.city;
    const locState = locations.address.state;
    const locZip = locations.address.zip;

    const locationshtmlSection = `
  <div id="locations" class="card text-center">
  <div class="card-header">
  ${locName}
  </div>
  <div class="card-body">
  <p class="card-text">${locStreet}${locCity}${locState}${locZip}</p>
  </div>
  </div>`;

    $("#ballot").append(locationshtmlSection);
  }
  //End of code to render locations

  //Grabbing users voting results
  function buttonClick() {
    $(".choicesbtn").on("click", function(event) {
      event.preventDefault();

      const name = $(this).data("id");
      const choice = $(this).data("state");

      const userVote = {
        name: name,
        choice: choice
      };
      console.log(userVote);
      posttodatabase(userVote.name, userVote.choice);
    });
  }

  function posttodatabase(name, choice) {
    $.post("/api/votes", {
      name: name,
      choice: choice
    }).then(() => {
      console.log("voted");
      // Reload the page to get the updated list
      location.reload();
    });

    // Send the POST request.
    /*    $.ajax("/api/votes", {
        type: "POST",
        data: votechoice
      }).then(function() {
        console.log("voted");
        // Reload the page to get the updated list
        location.reload();
      }); */
  }
});
