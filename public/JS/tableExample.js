// This code is for rendering all measures and cadidate by location.

$(document).ready(() => {
  //Getting Users Address
  const addressInput = $("#address-input");
  const addressBtn = $("#address-btn");

  addressBtn.click("submit", (event) => {
    event.preventDefault();
    const inputAddress = addressInput.val().trim();
    const replacedAddress = inputAddress.split(" ").join("+");
    const presidentwevoteUrl =
      "https://api.wevoteusa.org/apis/v1/voterBallotItemsRetrieve/?csrfmiddlewaretoken=ncRBy6zydqnBkz9zk2c4rOFh3nrxrLclLLWFFGvI9wt2L2WaehNtniMbpMifG6kl&voter_device_id=e9d5HVqN5duYmmWNDoonK5zyJ2KZh2CsHhnunVRpSnKlFF4sWdRKLBuOy5rESt1znScUhtcItDAxgk78ca7uQiBc&google_civic_election_id=&ballot_returned_we_vote_id=&ballot_location_shortcut=";
    grabMeasures(replacedAddress);
    grabLocation();
    grabPresidents(presidentwevoteUrl);
  });
});
// end of address button click function

//Grab Presidential Candidates from API



//Presidential Candidate Array
function grabPresidents(presidentparameter) {
  var presedentialCandidates = [];

  // Presidential Candidate Ajax Call
  $.ajax({
    method: "GET",
    url: presidentparameter,
  }).then(function(res) {
    const federaldata = res.ballot_item_list.filter(function(federal) {
      return federal.race_office_level === "Federal";
    });

    for (var index = 0; index < federaldata[1].candidate_list.length; index++) {
      presedentialCandidates.push(federaldata[1].candidate_list[index]);
    }

    presedentialCandidates.forEach(renderPresidents);
  });
}

function grabMeasures(addressparameter) {
  //Array to push local measures

  var measures = [];

  const queryU =
    "https://api.wevoteusa.org/apis/v1/voterAddressSave/?csrfmiddlewaretoken=mRyhv4vjUAzkGQMWxLZrswUw7BUG6NHe6ojzNTMqHzcWMOVR7vrbYtQvaQZ96m2v&voter_device_id=AE08n1yZqrtkFWv7jO9BeYESRiGQgQoYBfZ9TUxvnfnU0YANSl5NtZVyPGsFrKtXS0zmceW77e6ByyvKm2ky3p5F&text_for_map_search=" +
    addressparameter;

  // Meaures Ajax Call

  $.ajax({
    method: "GET",
    url: queryU,
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
  $.get("/api/googleapi").then((data) => {
    const locations = data.slice(0, 5);
    console.log(locations);

    locations.forEach(renderLocations);

    //function to render Locations
  });
}

// Function to Render Presidents
function renderPresidents(presidents) {
  const presidentcardimagesrc = presidents.candidate_photo_url_large;
  const presidentcardHeader = presidents.ballot_item_display_name;
  const presidentpartytext = presidents.party;
  const presidentcardBody = presidents.ballotpedia_candidate_summary;
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
      <div  class="btn-group btn-group-toggle" id="presidentchoice" data-toggle="buttons">
        <label data-value=${presidentid} for="choose"  class="btn btn-secondary">
          <input
            type="radio"
            name="choose"
            id= "choose"
            autocomplete="off"
            value="true"
            checked
          />
          Choose
        </label>
        <label data-value=${presidentid} for="oppose" class="btn btn-secondary">
          <input
            type="radio"
            name="oppose"
            id="oppose"
            autocomplete="off"
            value="false"
          />
          Oppose
        </label>
      </div>
    </div>
  </div>
</div>
    `;

  presidentcards.append(presidenthtmlSection);
}

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
        <div  class="btn-group btn-group-toggle propvote" id="measurechoice"     
            data-toggle="buttons">
             <label data-value=${measureid} for="choose" class="btn btn-secondary">
              <input
                type="radio"
                name="choose"
                id="choose"
                autocomplete="off"
                value="true"
                checked
              />
              Choose
            </label>
            <label data-value=${measureid} for="oppose" class="btn btn-secondary">
              <input
                type="radio"
                name="oppose"
                id="oppose"
                value="false"
                autocomplete="off"
              />
              Oppose
            </label>
          </div>
    </div>
  </div>`;

  $("#propositionscards").append(measureshtmlSection);
}
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
