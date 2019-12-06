const express = require('express');
const router = express.Router();

// Task Model
let Task = require('../models/task');
// User Model
let User = require('../models/user');

// Add Route
router.get('/add', ensureAuthenticated, function(req, res){
    res.render('add_task', {
        title:'Add Task'
    });
});

// Add Submit POST Route
router.post('/add', function(req, res){
    req.checkBody('title','Title is required').notEmpty();
    //req.checkBody('author','Author is required').notEmpty();
    req.checkBody('body','Body is required').notEmpty();

    // Get Errors
    let errors = req.validationErrors();

    if(errors){
        res.render('add_task', {
            title:'Add Task',
            errors:errors
        });
    } else {
        let task = new Task();
        task.title = req.body.title;
        task.author = req.user._id;
        task.body = req.body.body;

        task.save(function(err){
            if(err){
                console.log(err);
                return;
            } else {
                req.flash('success','Task Added');
                res.redirect('/');
            }
        });
    }
});

// Load Edit Form
router.get('/edit/:id', ensureAuthenticated, function(req, res){
    Task.findById(req.params.id, function(err, task){
        if(task.author != req.user._id){
            req.flash('danger', 'Not Authorized');
            return res.redirect('/');
        }
        res.render('edit_task', {
            title:'Edit Task',
            task:task
        });
    });
});

// Update Submit POST Route
router.post('/edit/:id', function(req, res){
    let task = {};
    task.title = req.body.title;
    task.author = req.body.author;
    task.body = req.body.body;

    let query = {_id:req.params.id}

    Task.update(query, task, function(err){
        if(err){
            console.log(err);
            return;
        } else {
            req.flash('success', 'Task Updated');
            res.redirect('/');
        }
    });
});

// Delete Task
router.delete('/:id', function(req, res){
    if(!req.user._id){
        res.status(500).send();
    }

    let query = {_id:req.params.id}

    Task.findById(req.params.id, function(err, task){
        if(task.author != req.user._id){
            res.status(500).send();
        } else {
            Task.remove(query, function(err){
                if(err){
                    console.log(err);
                }
                res.send('Success');
            });
        }
    });
});

// Get Single Task
router.get('/:id', function(req, res){
    Task.findById(req.params.id, function(err, task){
        User.findById(task.author, function(err, user){
            res.render('task', {
                task:task,
                author: user.name
            });
        });
    });
});

// Access Control
function ensureAuthenticated(req, res, next){
    if(req.isAuthenticated()){
        return next();
    } else {
        req.flash('danger', 'Please login');
        res.redirect('/users/login');
    }
}

module.exports = router;
