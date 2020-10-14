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

    presedentialCandidates.forEach(renderPresidents);
    measures.forEach(render);
  });

  function renderPresidents(presidents) {
    const presidentcardimagesrc = presidents.candidate_photo_url_large;
    const presidentcardHeader = presidents.ballot_item_display_name;
    const presidentpartytext = presidents.party;
    const presidentcardBody = presidents.ballotpedia_candidate_summary;
    const presidentcards = $("#presidentcards");


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
      <div class="btn-group btn-group-toggle" data-toggle="buttons">
        <label class="btn btn-secondary">
          <input
            type="radio"
            name="options"
            id="option1"
            autocomplete="off"
            checked
          />
          Choose
        </label>
        <label class="btn btn-secondary">
          <input
            type="radio"
            name="options"
            id="option3"
            autocomplete="off"
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

  function render(measures) {
    const measurecardHeader = measures.ballot_item_display_name;
    const measurecardBody = measures.measure_text;
    const measureyesBody = measures.yes_vote_description;
    const measurenoBody = measures.no_vote_description;

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
        <div class="btn-group btn-group-toggle propvote"      
            data-toggle="buttons">
             <label class="btn btn-secondary">
              <input
                type="radio"
                name="options"
                id="option1"
                autocomplete="off"
                checked
              />
              Choose
            </label>
            <label class="btn btn-secondary">
              <input
                type="radio"
                name="options"
                id="option3"
                autocomplete="off"
              />
              Oppose
            </label>
          </div>
    </div>
  </div>`;

    $("#propositionscards").append(measureshtmlSection);
  }

  /* $.ajax({
    method: "GET",
    url: "/api/googleapi"
  }).then(function(response) {
    console.log(response);
  }); */
});
