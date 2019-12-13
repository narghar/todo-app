let mongoose = require('mongoose');

// Task Schema
let taskSchema = mongoose.Schema({
    title:{
        type: String,
        required: true
    },
    filled: {
        type: Boolean,
        default: false
    },
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    }
});

let Task = module.exports = mongoose.model('Task', taskSchema);
