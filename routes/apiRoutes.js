var db = require("../models");
var passport = require("../config/passport");

module.exports = function (app) {
  // Using the passport.authenticate middleware with our local strategy.
  // If the user has valid login credentials, send them to the members page.
  // Otherwise the user will be sent an error
  app.post("/api/login", passport.authenticate("local"), function (req, res) {
    res.json(req.user);
  });

  // Route for signing up a user. The user's password is automatically hashed and stored securely thanks to
  // how we configured our Sequelize User Model. If the user is created successfully, proceed to log the user in,
  // otherwise send back an error
  app.post("/api/signup", function (req, res) {
    db.User.create({
        email: req.body.email,
        password: req.body.password
      })
      .then(function () {
        res.redirect(307, "/api/login");
      })
      .catch(function (err) {
        res.status(401).json(err);
      });
  });

  // Route for logging user out
  app.get("/logout", function (req, res) {
    req.logout();
    res.redirect("/");
  });

  // Route for getting some data about our user to be used client side
  app.get("/api/user_data", function (req, res) {
    if (!req.user) {
      // The user is not logged in, send back an empty object
      res.json({});
    } else {
      // Otherwise send back the user's email and id
      // Sending back a password, even a hashed password, isn't a good idea
      res.json({
        email: req.user.email,
        id: req.user.id
      });
    }
  });

  //start skeleton ----------------- (using employee database)
  //get list of all employees
  app.get("/api/employees", function (req, res) {
    db.User.findAll({})
      .then(function (dbUser) {
        res.json(dbUser);
      });
  });
  //find one employee by specific id
  app.get("/api/employees/:id", function (req, res) {
    db.User.findOne({
      where: {
        id: req.params.id
      },
    }).then(function (dbUser) {
      res.json(dbUser);
    });
  });

  //find all employees with a specific job title.  (using the roles database)
  app.get("/api/employees/:r_title", function (req, res) {
    db.User.findAll({
      where: {
        r_title: req.params.r_title
      },
    }).then(function (dbUser) {
      res.json(dbUser);
    });
  });
  //add new employees object deconstructuring
  app.post("/api/employees", function (req, res) {
    var {
      e_name,
      pswd,
      salary,
      score,
      is_manager,
      job_role,
    } = req.body;

    var newEmployee = {
      e_name,
      pswd,
      salary,
      score,
      is_manager,
      job_role,
    }
    db.User.create(newEmployee).then(function (dbUser) {
      console.log(`New Employee added ${dbUser.e_name}`)
      res.json({
        id: dbUser.id
      })
    });
  });
  //delete employees
  app.delete("/api/employees/:id", function (req, res) {
    db.User.destroy({
      where: {
        id: req.params.id
      },
    }).then(function (dbUser) {
      console.log(`Deleted Employee ${dbUser.e_name}`);
      res.end(dbUser);
    })
  })
  //update current employees
  app.put("/api/employees", function (req, res) {
    db.User.update({
        e_name: req.body.e_name,
        pswd: req.body.pswd,
        salary: req.body.salary,
        score: req.body.score,
        is_manager: req.body.is_manager,
        job_role: req.body.job_role
      }, {
        where: {
          id: req.body.id
        }
      }).then(function (dbUser) {
        res.json(dbUser);
      })
      .catch(function (err) {
        res.json(err);
      });
  });
  //end skeleton ----------------
}; //end module.exports function