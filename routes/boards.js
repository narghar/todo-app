const express = require("express");
const router = express.Router();
const ensureAuthenticated = require("../middleware");
const Board = require("../models/board");

router.get("/", ensureAuthenticated, function(req, res) {
  res.redirect("/");
});

router.get('/add', ensureAuthenticated, function(req, res){
    res.render('add_board', {
        title:'Add Board'
    });
});

router.post("/add", ensureAuthenticated,  async (req, res) => {
  req.checkBody("name", "Title is required").notEmpty();
  //req.checkBody('image','Image URL is required').notEmpty();
  //req.checkBody("desc", "Description is required").notEmpty();

  // Get Errors
  let errors = req.validationErrors();

  if (errors) {
    res.render("add_board", {
      title: "Add Board",
      errors: errors
    });
  } else {
   let board = new Board({
      name: req.body.name,
      image: req.body.image,
      description: req.body.desc,
      author: {
        id: req.user._id,
        username: req.user.username
      }
    });
    await board.save(function(err){
        if(err){
            console.log(err);
            return;
        } else {
            req.flash('success','Board Added');
            res.redirect('/');
        }
    });

  }
});

module.exports = router;
