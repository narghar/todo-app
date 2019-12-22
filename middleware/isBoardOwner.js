const Board = require('../models/board');

async function isBoardOwner(req, res, next) {
    Board.findById(req.body.boardId, function(err, board) {
        console.log(req.session.passport.user);
        console.log(board.author.id);
        if (req.session.passport.user == board.author.id) {
            console.log("IM in if")
            next();
        }
        else {
            console.log("DUPA");
            res.status(401).send("Acces denied");
        }
    });
}

module.exports = isBoardOwner;