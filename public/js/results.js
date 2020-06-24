$(document).ready(function () {
  /* global moment */

  // blogContainer holds all of our posts
  var playerContainer = $(".player-container");
  var postCategorySelect = $("#category");
  // Click events for the edit and delete buttons

  $(document).on("click", "button.delete", handlePlayerDelete);
  $(document).on("click", "button.delete", handlePlayerDelete);
  $(document).on("click", "button.edit", handlePlayerEdit);

  // Variable to hold our posts
  var players = [];

  // The code below handles the case where we want to get blog posts for a specific author
  // Looks for a query param in the url for author_id
  var url = window.location.search;
  var userId;
  if (url.indexOf("?user_id=") !== -1) {
    userId = url.split("=")[1];
    getPosts(console.table(userId));
  }
  // If there's no authorId we just get all posts as usual
  else {
    getPosts();
  }

  // This function grabs posts from the database and updates the view
  function getPosts(user) {
    userId = user || "";
    if (userId) {
      userId = "/?user_id=" + userId;
    }
    $.get("/api/players" + userId, function (data) {
      console.log("players", data);
      players = data;
      if (!players || !players.length) {
        displayEmpty(players);
      } else {
        initializeRows();
      }
    });
  }

  // // This function does an API call to delete posts
  // function deletePost(id) {
  //   $.ajax({
  //     method: "DELETE",
  //     url: "/api/posts/" + id
  //   })
  //     .then(function() {
  //       getPosts(postCategorySelect.val());
  //     });
  // }

  // InitializeRows handles appending all of our constructed post HTML inside blogContainer
  function initializeRows() {
    playerContainer.empty();
    var playerToAdd = [];
    for (var i = 0; i < players.length; i++) {
      playerToAdd.push(createNewRow(players[i]));
    }
    playerContainer.append(playerToAdd);
  }

  // // This function constructs a post's HTML
  // function createNewRow(post) {
  //   var formattedDate = new Date(post.createdAt);
  //   formattedDate = moment(formattedDate).format("MMMM Do YYYY, h:mm:ss a");
  //   var newPostCard = $("<div>");
  //   newPostCard.addClass("card");
  //   var newPostCardHeading = $("<div>");
  //   newPostCardHeading.addClass("card-header");
  //   var deleteBtn = $("<button>");
  //   deleteBtn.text("x");
  //   deleteBtn.addClass("delete btn btn-danger");
  //   var editBtn = $("<button>");
  //   editBtn.text("EDIT");
  //   editBtn.addClass("edit btn btn-info");
  //   var newPostTitle = $("<h2>");
  //   var newPostDate = $("<small>");
  //   var newPostAuthor = $("<h5>");
  //   newPostAuthor.text("Written by: Author name display is in next activity when we learn joins!");
  //   newPostAuthor.css({
  //     float: "right",
  //     color: "blue",
  //     "margin-top":
  //     "-10px"
  //   });
  //   var newPostCardBody = $("<div>");
  //   newPostCardBody.addClass("card-body");
  //   var newPostBody = $("<p>");
  //   newPostTitle.text(post.title + " ");
  //   newPostBody.text(post.body);
  //   newPostDate.text(formattedDate);
  //   newPostTitle.append(newPostDate);
  //   newPostCardHeading.append(deleteBtn);
  //   newPostCardHeading.append(editBtn);
  //   newPostCardHeading.append(newPostTitle);
  //   newPostCardHeading.append(newPostAuthor);
  //   newPostCardBody.append(newPostBody);
  //   newPostCard.append(newPostCardHeading);
  //   newPostCard.append(newPostCardBody);
  //   newPostCard.data("post", post);
  //   return newPostCard;
  // }

  // // This function figures out which post we want to delete and then calls deletePost
  // function handlePostDelete() {
  //   var currentPost = $(this)
  //     .parent()
  //     .parent()
  //     .data("post");
  //   deletePost(currentPost.id);
  // }

  // // This function figures out which post we want to edit and takes it to the appropriate url
  // function handlePostEdit() {
  //   var currentPost = $(this)
  //     .parent()
  //     .parent()
  //     .data("post");
  //   window.location.href = "/cms?post_id=" + currentPost.id;
  // }

  // This function displays a message when there are no posts
  function displayEmpty(id) {
    var query = window.location.search;
    var partial = "";
    if (id) {
      partial = " for User #" + id;
    }
    playerContainer.empty();
    var statsH2 = $("<h2>");
    statsH2.css({ "text-align": "center", "margin-top": "50px" });
    statsH2.html(
      "No stats yet" +
        partial +
        ", navigate <a href='/user" +
        query +
        "'>here</a> in order to get started."
    );
    playerContainer.append(statsH2);
  }
});
