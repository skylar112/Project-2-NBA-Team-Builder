const db = require("../models");


module.exports = function(app) {
    // Find all players and return them to the user with res.json
    app.get("/api/players", async function(req, res) {
      const dbPlayer= await db.Player.findAll({
        include: [db.Teams]
      })
      res.json(dbPlayer);
    });
  
    app.get("/api/players/:id", async function(req, res) {
      // Find one  players with the id in req.params.id and return them to the user with res.json
      const dbPlayer = await db.Player.findOne({
        where: {
          id: req.params.id
        },
        include: [db.Temas]
      })
      res.json(dbPlayer);
    });
  
    app.post("/api/players", async function(req, res) {
      // Create an players with the data available to us in req.body
      console.log(req.body);
      const dbPlayer = await db.Player.create(req.body)
      res.json(dbPlayer);
    });
  
    app.delete("/api/players/:id", async function(req, res) {
      // Delete the  players with the id available to us in req.params.id
      const dbPlayer = await db.Player.destroy({
        where: {
          id: req.params.id
        }
      })
      res.json(dbPlayer);
    });
  
 
 
 
 
 
 
 
 
 
  };
  