$(document).ready(() => {
  // Getting references to our form and input
  const signUpForm = $("form.signup");
  const emailInput = $("input#email-input");
  const passwordInput = $("input#password-input");
  const addressInput = $("input#inputAddress");
  const cityInput = $("input#inputCity");
  const stateInput = $("input#inputState");
  const zipInput = $("input#inputZip");


  // When the signup button is clicked, we validate the email and password are not blank
  signUpForm.on("submit", event => {
    event.preventDefault();
    const userData = {
      email: emailInput.val().trim(),
      password: passwordInput.val().trim(),
      address:addressInput.val().trim(),
      city:cityInput.val().trim(),
      state:cityInput.val(),
      zipcode:zipInput.val().trim()
    };
    if (!userData.email || !userData.password ) {
      return;
    }
    // If we have an email and password, run the signUpUser function
    signUpUser(userData.email, userData.password, userData.address, userData.city, userData.state, userData.zipcode);
    emailInput.val("");
    passwordInput.val("");
    addressInput.val("");
    cityInput.val("");
    stateInput.val("");
    zipInput.val("");
  });

  // Does a post to the signup route. If successful, we are redirected to the members page
  // Otherwise we log any errors
  function signUpUser(email,password,address,city,state,zipcode) {
    $.post("/api/signup", {
      email: email,
      password: password,
      address: address,
      city: city,
      state: state,
      zipcode: zipcode
    })
      .then(() => {
        window.location.replace("/members");
        // If there's an error, handle it by throwing up a bootstrap alert
      })
      .catch(handleLoginErr);
  }

  function handleLoginErr(err) {
    $("#alert .msg").text(err.responseJSON);
    $("#alert").fadeIn(500);
  }
});
