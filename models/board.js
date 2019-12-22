let mongoose = require('mongoose');

const boardSchema = new mongoose.Schema({
   name: String,
   image: String,
   description: String,
   author: {
      id: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "User"
      },
      username: String
   },
   tasks: [
      {
         type: mongoose.Schema.Types.ObjectId,
         ref: "Task"
      }
   ],
   coworkers: [
      {
         type: mongoose.Schema.Types.ObjectId,
         ref: "User",
      },
   ],
   coworkersName: [
      {
         username: String
      }
   ]
});

module.exports = mongoose.model("Board", boardSchema);
