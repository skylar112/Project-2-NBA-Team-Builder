// *********************************************************************************
// api-routes.js - this file offers a set of routes for displaying and saving data to the db
// *********************************************************************************

// Dependencies
// =============================================================

// Requiring our models
const db = require("../models");

// Routes
// =============================================================
module.exports = function(app) {

  // GET route for getting all of the posts
  app.get("/api/posts", async function(req, res) {
    var query = {};
    if (req.query.author_id) {
      query.AuthorId = req.query.author_id;
    }
    const dbPost = await db.Post.findAll({
      where: query,
      include: [db.Author]
    })
    res.json(dbPost);
  });

  // Get route for retrieving a single post
  app.get("/api/posts/:id", async function(req, res) {
    const dbPost = await db.Post.findOne({
      where: {
        id: req.params.id
      },
      include: [db.Author]
    })
    res.json(dbPost);
  });

  // POST route for saving a new post
  app.post("/api/posts", async function(req, res) {
    const dbPost = await db.Post.create(req.body)
    res.json(dbPost);
  });

  // DELETE route for deleting posts
  app.delete("/api/posts/:id", async function(req, res) {
    const dbPost = await db.Post.destroy({
      where: {
        id: req.params.id
      }
    })
    res.json(dbPost);
  });

  // PUT route for updating posts
  app.put("/api/posts", async function(req, res) {
    const dbPost = await db.Post.update(
      req.body,
      {
        where: {
          id: req.body.id
        }
      })
    res.json(dbPost);
  });
};
