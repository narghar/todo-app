let mongoose = require('mongoose');

// Task Schema
let taskSchema = mongoose.Schema({
    title:{
        type: String,
        required: true
    },
    author:{
        type: String,
        required: true
    },
    body:{
        type: String,
        required: true
    }
});

let Task = module.exports = mongoose.model('Task', taskSchema);