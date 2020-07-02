$(document).ready(function () {
  // Getting references to the name input and author container, as well as the table body

  var playerInput = $("#player-name").val();
  var playerList = $("tbody");
  var playerContainer = $(".player-container");
  var player2 = [];

  // Adding event listeners to the form to create a new object, and the button to delete
  // an Author
  $(document).on("submit", "#player-form", handlePlayerFormSubmit);
  $(document).on("click", ".delete-player", handleDeleteButtonPress);
  $(document).on("click", ".show-stats-modal", handleStatsModalPress);
  $("#stats-dis").empty();
  // Getting the initial list of Authors

  getPlayers();

  function handleStatsModalPress(event) {
    playerInput = $(this).siblings(".playerName").text();
    console.log("player input", playerInput);

    $.ajax({
      url: `https://www.balldontlie.io/api/v1/players/?search=${playerInput}`,
      method: "GET",
    }).then(function (response) {
      console.log("player id", response.data[0].id);

      var playerStats = response.data[0].id;

      $.ajax({
        url: `https://www.balldontlie.io/api/v1/players/${playerStats}`,
        method: "GET",
      }).then(function (response) {
        console.log("stats id", response.id);
        var playerStats2 = response.id;
        //creat h3 to call in player name into modal
        $.ajax({
          url: `https://www.balldontlie.io/api/v1/season_averages?player_ids[]=${playerStats2}`,
          method: "GET",
        }).then(function (response) {
          console.log("average", response);

         
          if (!response.data[0]) {
            $("#exampleModalLabel2").text(playerInput);
            $(".modal-body2").html(
              "<p class= text-center>" + "Player is Unavailable" + "</p>"
            );
            $("#exampleModal2").modal("show");
            gsap.to("#exampleModal2", {duration: 1, x: 200, ease: "bounce"});
            
            return;

          }

          $(".modal-body").empty();
          $("#exampleModalLabel").text(playerInput + " Stats");

          $(".modal-body").append(
            "<p>" +
              "Games Played: " +
              response.data[0].games_played +
              "<p>" +
              "<p>" +
              "Points Per Game: " +
              response.data[0].pts +
              "<p>" +
              "<p>" +
              "Rebounds Per Game: " +
              response.data[0].reb +
              "<p>" +
              "<p>" +
              "Assist Per Game: " +
              response.data[0].ast +
              "<p>" +
              "<p>" +
              "Turnovers Per Game: " +
              response.data[0].turnover +
              "<p>" +
              "<p>" +
              "Steals Per Game: " +
              response.data[0].stl +
              "<p>" +
              "<p>" +
              "Mins Per Game: " +
              response.data[0].min +
              "<p>" +
              "<p>" +
              "Block Per Game: " +
              response.data[0].blk +
              "<p>" 
           
          );
          $("#exampleModal").modal("show");
          gsap.to("#exampleModal", {duration: 1, rotation: 360, scale: 0.8,});

          
        });
      });
    });
  }
  // A function to handle what happens when the form is submitted to create a new Author
  function handlePlayerFormSubmit(event) {
    event.preventDefault();

    var playerInput = $("#player-name").val();
    console.log(playerInput);
    // Don't do anything if the name fields hasn't been filled out
    if (!playerInput) {
      return;
    }
    // Calling the upsertAuthor function and passing in the value of the name input
    upsertPlayer({
      player_name: playerInput,
    });

    console.log("new p-input" + playerInput);
  }

  // A function for creating an author. Calls getPlayue upon completion
  function upsertPlayer(playerData) {
    const urlParams = new URLSearchParams(window.location.search);
    const userId = urlParams.get("user_id");

    playerData.user_id = userId;
    playerInput = $("#player-name").val();
    player2.length = Math.min(player2.length, 4);

    //playersArray2 = [];
    player2.push(playerInput), console.log("position1" + player2[0]);
    console.log(player2);
    $.post("/api/players", playerData).then(getPlayers);
  }

  // Function for creating a new list row for authors
  function createPlayerRow(playerData) {
    console.log(playerData.player_name);
    var newTr = $("<tr>");
    newTr.data("player", playerData);
    newTr.append("<td class='playerName'>" + playerData.player_name + "</td>");
    newTr.append(
      `<td class="show-stats-modal"> <a href="#">Show Stats</a> </td>`
    );

    newTr.append(
      "<td><a style='cursor:pointer;color:red' class='delete-player'>Delete Player</a></td>"
    );
    console.log(playerData.id);
    console.log(newTr);
    return newTr;
  }

  // Function for retrieving authors and getting them ready to be rendered to the page
  function getPlayers() {
    const urlParams = new URLSearchParams(window.location.search);
    const userId = urlParams.get("user_id");

    $.get("/api/players/" + userId, function (data) {
      var rowsToAdd = [];
      for (var i = 0; i < data.length; i++) {
        rowsToAdd.push(createPlayerRow(data[i]));
      }
      renderPlayerList(rowsToAdd);
      console.log("player2= " + player2);

      //playerInput;
    });
  }

  // A function for rendering the list of authors to the page
  function renderPlayerList(rows) {
    playerList.children().not(":last").remove();
    playerContainer.children(".alert").remove();
    if (rows.length) {
      console.log("this is row" + rows);
      playerList.prepend(rows);
    } else {
      renderEmpty();
    }
  }

  // Function for handling what to render when there are no authors
  function renderEmpty() {
    var alertDiv = $("<div>");
    alertDiv.addClass("alert alert-danger");
    alertDiv.text("You must add a player.");
    playerContainer.append(alertDiv);
  }

  // Function for handling what happens when the delete button is pressed
  function handleDeleteButtonPress() {
    var listItemData = $(this).parent("td").parent("tr").data("player");
    var id = listItemData.id;
    $.ajax({
      method: "DELETE",
      url: "/api/players/" + id,
    }).then(getPlayers);
    $("#stats-dis").empty();
  }
});
