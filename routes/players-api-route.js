const db = require("../models");


module.exports = function(app) {
    // Find all Authors and return them to the user with res.json
    app.get("/api/authors", async function(req, res) {
      const dbAuthor = await db.Author.findAll({
        include: [db.Post]
      })
      res.json(dbAuthor);
    });
  
    app.get("/api/authors/:id", async function(req, res) {
      // Find one Author with the id in req.params.id and return them to the user with res.json
      const dbAuthor = await db.Author.findOne({
        where: {
          id: req.params.id
        },
        include: [db.Post]
      })
      res.json(dbAuthor);
    });
  
    app.post("/api/authors", async function(req, res) {
      // Create an Author with the data available to us in req.body
      console.log(req.body);
      const dbAuthor = await db.Author.create(req.body)
      res.json(dbAuthor);
    });
  
    app.delete("/api/authors/:id", async function(req, res) {
      // Delete the Author with the id available to us in req.params.id
      const dbAuthor = await db.Author.destroy({
        where: {
          id: req.params.id
        }
      })
      res.json(dbAuthor);
    });
  
  };
  