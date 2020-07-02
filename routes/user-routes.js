const db = require("../models");

module.exports = function (app) {
  console.log(db.user);

  // Find all Authors and return them to the user with res.json
  app.get("/api/user", async function (req, res) {
    const dbUser = await db.user.findAll({});

    res.json(dbUser);
  });
    
  app.put("/api/user/:id", async function(req, res) {
    const dbUser = await db.user.update(req.body,
      {
        where: {
          id: req.params.id
        }
      })
    res.json(dbUser);
  });
  
  
  app.post("/api/user", async function (req, res) {
    // Create an Author with the data available to us in req.body
    console.log(req.body);
    const dbUser = await db.user.create(req.body);
    res.json(dbUser);
  });

    app.delete("/api/user/:id", async function(req, res) {
      // Delete the Author with the id available to us in req.params.id
      const dbUser = await db.user.destroy({
        where: {
          id: req.params.id
        }
      })
      res.json(dbUser);
    });
};
