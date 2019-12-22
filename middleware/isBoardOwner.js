const Board = require('../models/board');

async function isBoardOwner(req, res, next) {
    Board.findById(req.body.boardId, function(err, board) {
        if (req.session.passport.user == board.author.id) {
            next();
        }
        else {
            res.status(401).send("Acces denied");
        }
    });
}

module.exports = isBoardOwner;