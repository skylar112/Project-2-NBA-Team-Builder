// *********************************************************************************
// api-routes.js - this file offers a set of routes for displaying and saving data to the db
// *********************************************************************************

// Dependencies
// =============================================================

// Requiring our models
const db = require("../models");

// Routes
// =============================================================
module.exports = function (app) {
  // GET route for getting all of the teams
  app.get("/api/teams", async function (req, res) {
    var query = {};
    if (req.query.player_id) {
      query.PlayerId = req.query.player_id;
    }
    const dbTeams = await db.Teams.findAll({
      where: query,
      include: [db.Player],
    });
    res.json(dbTeams);
  });

  // Get route for retrieving a single team
  app.get("/api/teams/:id", async function (req, res) {
    const dbTeams = await db.Post.findOne({
      where: {
        id: req.params.id,
      },
      include: [db.Teams],
    });
    res.json(dbTeams);
  });

  // POST route for saving a new team
  app.post("/api/teams", async function (req, res) {
    const dbTeams = await db.Teams.create(req.body);
    res.json(dbTeams);
  });

  // DELETE route for deleting team
  app.delete("/api/teams/:id", async function (req, res) {
    const dbTeams = await db.Teams.destroy({
      where: {
        id: req.params.id,
      },
    });
    res.json(dbTeams);
  });

  // PUT route for updating team
  app.put("/api/teams", async function (req, res) {
    const dbTeams = await db.Teams.update(req.body, {
      where: {
        id: req.body.id,
      },
    });
    res.json(dbTeams);
  });
};
