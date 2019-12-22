const Board = require('../models/board');

async function canCompliteTasks(req, res, next) {
    Board.findById(req.body.boardId, function(err, board) {
        console.log(req.session.passport.user);
        console.log(board.author.id);
        if (req.session.passport.user == board.author.id || isCoworker(board, req.session.passport.user)) {
            next();
        } else {
            console.log("DUPA");
            res.status(401).send("Acces denied");
        }
    });
}

function isCoworker(board, userId) {
    for (let i = 0; i < board.coworkers.length; i++) {
        if (board.coworkers[i] == userId) {
            return true;
        }
    }
    return false;
}

module.exports = canCompliteTasks;