$(document).ready(function () {
  var userNameForm = $("form.user-name");
  var userInput = $("input#user-input");
 
  userNameForm.on("submit", function(event) {
    event.preventDefault();
    var userData = {
      name: userInput.val().trim(),
      };

    if (!userData.name) {
      return;
    }

    // If we have an email and password we run the loginUser function and clear the form
    loginUser(userData.name);
    userInput.val("");
    
  });

  function loginUser(name) {
    $.post("/api/users", {
      name: name,
      
    })
      .then(function() {
        window.location.replace("/users");
        // If there's an error, log the error
      })
      .catch(function(err) {
        console.log(err);
      });
  }
  // $("form").on("submit", function (e) {
  //   e.preventDefault();
  //   var userInput = $('input[name="username"]').val();
  //   console.log(userInput);
  // });



});
