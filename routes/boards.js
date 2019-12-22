const express = require("express");
const router = express.Router();
const ensureAuthenticated = require("../middleware/ensureAuthenticated");
const isBoardOwner = require("../middleware/isBoardOwner");
const Board = require("../models/board");
const Task = require('../models/task');
const User = require('../models/user');

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

router.delete('/:id', ensureAuthenticated, isBoardOwner, async function (req, res) {
  await Board.findById(req.params.id, function(err, board)  {
    if (err) {
      res.status(400).send("Invalid board Id");
    } 
    else {
      const taskList = board.tasks;
      for (let i = 0; i  < taskList.length; i++) {
        Task.findById(taskList[i], function (err, task) {
          if (err) {
            console.log("something broken with database");
          } else {
            task.delete();
          }
        })
      }
      board.delete();
      res.status(200).send();
    }
  });
});

router.put('/coworker/', ensureAuthenticated, isBoardOwner, function (req, res) {
  User.find({username: req.body.user}, async function(err, user) {
    if (user[0] === undefined) {
      return res.status(400).send("User not found");
    } else {
      await Board.findById(req.body.boardId, async function (err, board) {
        if (req.session.passport.user == board.author.id) {
          return res.status(400).send("User has permission");
        }
        let permission = true;
        for (let i = 0; i < board.coworkers.length; i++) {
          console.log(board.coworkers[i]);
          if (board.coworkers[i] == user._id ) {
            permission = false;
            return res.status(400).send('User alredy has permission');
          }
        }  
        if (permission) { 
          board.coworkers.push(user[0]._id);
          board.coworkersName.push({"username": user[0].username});
          await board.save() }
          res.status(200).send("HAHAHHA");
        });
      }
    })
  });

module.exports = router;
