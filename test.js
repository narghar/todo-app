let board = ["1", "2", '3', "4"];
let x = 4;

board = board.filter(e => e !== x.toString());

console.log(board);
