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

  function handleStatsModalPress (event){
        playerInput = $(this).siblings(".playerName").text()
        console.log("player input",playerInput)
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
        console.log("stats id",response.id);
        var playerStats2 = response.id;

        $.ajax({
          url: `https://www.balldontlie.io/api/v1/season_averages?player_ids[]=${playerStats2}`,
          method: "GET",
        }).then(function (response) {
          console.log("average",response);
          $(".modal-body").empty();

          $(".modal-body").append(
            "<p>" + "Games Played: " + response.data[0].games_played + "<p>" +
            "<p>" + "Points Per Game: " + response.data[0].pts + "<p>" +
            "<p>" + "Rebounds Per Game: " + response.data[0].reb + "<p>" +
            "<p>" + "Assist Per Game: " + response.data[0].ast + "<p>" +
            "<p>" + "Turnovers Per Game: " + response.data[0].turnover + "<p>" +
            "<p>" + "Steals Per Game: " + response.data[0].stl + "<p>" +
            "<p>" + "Mins Per Game: " + response.data[0].min + "<p>" +
            "<p>" + "Block Per Game: " + response.data[0].blk + "<p>" +
            "<p>" + "Block Per Game: " + response.data[0].reb + "<p>" 
           
          ); 
          
          $("#exampleModal").modal("show");
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
            
    // $.ajax({
    //   url: `https://www.balldontlie.io/api/v1/players/?search=${playerInput}`,
    //   method: "GET",
    // }).then(function (response) {
    //   console.log("player id", response.data[0].id);

    //   var playerStats = response.data[0].id;

    //   $.ajax({
    //     url: `https://www.balldontlie.io/api/v1/players/${playerStats}`,
    //     method: "GET",
    //   }).then(function (response) {
    //     console.log("stats id",response.id);
    //     var playerStats2 = response.id;

    //     $.ajax({
    //       url: `https://www.balldontlie.io/api/v1/season_averages?player_ids[]=${playerStats2}`,
    //       method: "GET",
    //     }).then(function (response) {
    //       console.log("average",response);

    //       $("#stats-dis").append(
    //         "<td>" + "Games Played: " + response.data[0].games_played + "<td>"
    //       );
    //     });
    //   });
    // });
  }

  // A function for creating an author. Calls getPlayue upon completion
  function upsertPlayer(playerData) {
    const urlParams = new URLSearchParams(window.location.search);
    const userId = urlParams.get('user_id');

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
    newTr.append(`<td class="show-stats-modal"> <a href="#">Show Stats</a> </td>`);
    newTr.append(
      "<td><a href='/results?player_id=" +
        playerData.id +
        "'>Go to Teams</a></td>"
    );
    newTr.append(
      "<td><a href='/teams?player_id=" +
        playerData.id +
        "'>Create a team</a></td>"
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
    const userId = urlParams.get('user_id');

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


  // function handleGetId(playerData) {

  //   var id = playerData.id;
  //   $.ajax({
  //     method: "GET",
  //     url: "/api/players/" + id,
  //   }).then( handleGetId());
  // }

  // handleGetId()
});

//   /* global moment */

//   // blogContainer holds all of our posts
//   var playerContainer = $(".player-container");
//   var postCategorySelect = $("#category");
//   // Click events for the edit and delete buttons

//   $(document).on("click", "button.submit", handlePlayerPost);
//   $(document).on("click", "button.delete", handlePlayerDelete);
//   $(document).on("click", "button.edit", handlePlayerEdit);

//   // Variable to hold our posts
//   var players = [];

//   // The code below handles the case where we want to get blog posts for a specific author
//   // Looks for a query param in the url for author_id
//   var url = window.location.search;
//   var userId;
//   if (url.indexOf("?user_id=") !== -1) {
//     userId = url.split("=")[1];
//     getPosts(console.table(userId));
//   }
//   // If there's no authorId we just get all posts as usual
//   else {
//     getPosts();
//   }

//   // This function grabs posts from the database and updates the view
//   function getPosts(user) {
//     userId = user || "";
//     if (userId) {
//       userId = "/?user_id=" + userId;
//     }
//     $.get("/api/players" + userId, function (data) {
//       console.log("players", data);
//       players = data;
//       if (!players || !players.length) {
//         displayEmpty(players);
//       } else {
//         initializeRows();
//       }
//     });
//   }

//   // // This function does an API call to delete posts
//   // function deletePost(id) {
//   //   $.ajax({
//   //     method: "DELETE",
//   //     url: "/api/posts/" + id
//   //   })
//   //     .then(function() {
//   //       getPosts(postCategorySelect.val());
//   //     });
//   // }

//   // InitializeRows handles appending all of our constructed post HTML inside blogContainer
//   function initializeRows() {
//     playerContainer.empty();
//     var playerToAdd = [];
//     for (var i = 0; i < players.length; i++) {
//       playerToAdd.push(createNewRow(players[i]));
//     }
//     playerContainer.append(playerToAdd);
//   }

//   // // This function constructs a post's HTML
//   // function createNewRow(post) {
//   //   var formattedDate = new Date(post.createdAt);
//   //   formattedDate = moment(formattedDate).format("MMMM Do YYYY, h:mm:ss a");
//   //   var newPostCard = $("<div>");
//   //   newPostCard.addClass("card");
//   //   var newPostCardHeading = $("<div>");
//   //   newPostCardHeading.addClass("card-header");
//   //   var deleteBtn = $("<button>");
//   //   deleteBtn.text("x");
//   //   deleteBtn.addClass("delete btn btn-danger");
//   //   var editBtn = $("<button>");
//   //   editBtn.text("EDIT");
//   //   editBtn.addClass("edit btn btn-info");
//   //   var newPostTitle = $("<h2>");
//   //   var newPostDate = $("<small>");
//   //   var newPostAuthor = $("<h5>");
//   //   newPostAuthor.text("Written by: Author name display is in next activity when we learn joins!");
//   //   newPostAuthor.css({
//   //     float: "right",
//   //     color: "blue",
//   //     "margin-top":
//   //     "-10px"
//   //   });
//   //   var newPostCardBody = $("<div>");
//   //   newPostCardBody.addClass("card-body");
//   //   var newPostBody = $("<p>");
//   //   newPostTitle.text(post.title + " ");
//   //   newPostBody.text(post.body);
//   //   newPostDate.text(formattedDate);
//   //   newPostTitle.append(newPostDate);
//   //   newPostCardHeading.append(deleteBtn);
//   //   newPostCardHeading.append(editBtn);
//   //   newPostCardHeading.append(newPostTitle);
//   //   newPostCardHeading.append(newPostAuthor);
//   //   newPostCardBody.append(newPostBody);
//   //   newPostCard.append(newPostCardHeading);
//   //   newPostCard.append(newPostCardBody);
//   //   newPostCard.data("post", post);
//   //   return newPostCard;
//   // }

//   // This function figures out which post we want to delete and then calls deletePost
//   function handlePlayerDelete() {
//     var currentPlayer = $(this).parent().parent().data("player");
//     deletePost(currentPlayer.id);
//   }

//   // This function figures out which post we want to edit and takes it to the appropriate url
//   function handlePlayerEdit() {
//     var currentPlayer = $(this).parent().parent().data("post");
//     window.location.href = "/cms?player_id=" + currentPlayer.id;
//   }

//   // This function displays a message when there are no posts
//   function displayEmpty(id) {
//     var query = window.location.search;
//     var partial = "";
//     if (id) {
//       partial = " for User #" + id;
//     }
//     playerContainer.empty();
//     var statsH2 = $("<h2>");
//     statsH2.css({ "text-align": "center", "margin-top": "50px" });
//     statsH2.html(
//       "No stats yet" +
//         partial +
//         ", navigate <a href='/user" +
//         query +
//         "'>here</a> in order to get started."
//     );
//     playerContainer.append(statsH2);
//   }
// });

// $(document).ready(function() {
//     // Getting jQuery references to the post body, title, form, and author select
//     var bodyInput = $("#body");
//     var titleInput = $("#title");
//     var cmsForm = $("#cms");
//     var authorSelect = $("#author");
//     // Adding an event listener for when the form is submitted
//     $(cmsForm).on("submit", handleFormSubmit);
//     // Gets the part of the url that comes after the "?" (which we have if we're updating a post)
//     var url = window.location.search;
//     var postId;
//     var authorId;
//     // Sets a flag for whether or not we're updating a post to be false initially
//     var updating = false;

//     // If we have this section in our url, we pull out the post id from the url
//     // In '?post_id=1', postId is 1
//     if (url.indexOf("?post_id=") !== -1) {
//       postId = url.split("=")[1];
//       getPostData(postId, "post");
//     }
//     // Otherwise if we have an author_id in our url, preset the author select box to be our Author
//     else if (url.indexOf("?author_id=") !== -1) {
//       authorId = url.split("=")[1];
//     }

//     // Getting the authors, and their posts
//     getAuthors();

//     // A function for handling what happens when the form to create a new post is submitted
//     function handleFormSubmit(event) {
//       event.preventDefault();
//       // Wont submit the post if we are missing a body, title, or author
//       if (!titleInput.val().trim() || !bodyInput.val().trim() || !authorSelect.val()) {
//         return;
//       }
//       // Constructing a newPost object to hand to the database
//       var newPost = {
//         title: titleInput
//           .val()
//           .trim(),
//         body: bodyInput
//           .val()
//           .trim(),
//         AuthorId: authorSelect.val()
//       };

//       // If we're updating a post run updatePost to update a post
//       // Otherwise run submitPost to create a whole new post
//       if (updating) {
//         newPost.id = postId;
//         updatePost(newPost);
//       }
//       else {
//         submitPost(newPost);
//       }
//     }

//     // Submits a new post and brings user to blog page upon completion
//     function submitPost(post) {
//       $.post("/api/posts", post, function() {
//         window.location.href = "/blog";
//       });
//     }

//     // Gets post data for the current post if we're editing, or if we're adding to an author's existing posts
//     function getPostData(id, type) {
//       var queryUrl;
//       switch (type) {
//       case "post":
//         queryUrl = "/api/posts/" + id;
//         break;
//       case "author":
//         queryUrl = "/api/authors/" + id;
//         break;
//       default:
//         return;
//       }
//       $.get(queryUrl, function(data) {
//         if (data) {
//           console.log(data.AuthorId || data.id);
//           // If this post exists, prefill our cms forms with its data
//           titleInput.val(data.title);
//           bodyInput.val(data.body);
//           authorId = data.AuthorId || data.id;
//           // If we have a post with this id, set a flag for us to know to update the post
//           // when we hit submit
//           updating = true;
//         }
//       });
//     }

//     // A function to get Authors and then render our list of Authors
//     function getAuthors() {
//       $.get("/api/authors", renderAuthorList);
//     }
//     // Function to either render a list of authors, or if there are none, direct the user to the page
//     // to create an author first
//     function renderAuthorList(data) {
//       if (!data.length) {
//         window.location.href = "/authors";
//       }
//       var rowsToAdd = [];
//       for (var i = 0; i < data.length; i++) {
//         rowsToAdd.push(createAuthorRow(data[i]));
//       }
//       authorSelect.empty();
//       console.log(rowsToAdd);
//       console.log(authorSelect);
//       authorSelect.append(rowsToAdd);
//       authorSelect.val(authorId);
//     }

//     // Creates the author options in the dropdown
//     function createAuthorRow(author) {
//       var listOption = $("<option>");
//       listOption.attr("value", author.id);
//       listOption.text(author.name);
//       return listOption;
//     }

//     // Update a given post, bring user to the blog page when done
//     function updatePost(post) {
//       $.ajax({
//         method: "PUT",
//         url: "/api/posts",
//         data: post
//       })
//         .then(function() {
//           window.location.href = "/blog";
//         });
//     }
