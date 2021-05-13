const Immer = require("immer");
const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const io = require("socket.io")(server);

let current_puzzle = "Jinhoo Ahn - 2 Stars 20:00";
const puzzles = {
  "Jinhoo Ahn - 2 Stars 20:00": {
    stars: 2,
    size: 10,
    regions: [
      [1, 1, 1, 1, 1, 1, 2, 2, 2, 2],
      [1, 1, 1, 1, 1, 2, 2, 2, 2, 5],
      [1, 1, 3, 3, 3, 2, 2, 4, 5, 5],
      [1, 1, 1, 3, 3, 2, 4, 4, 5, 5],
      [6, 1, 1, 1, 3, 4, 4, 4, 5, 5],
      [6, 6, 7, 7, 7, 9, 5, 5, 5, 5],
      [6, 6, 7, 7, 8, 9, 9, 5, 5, 5],
      [6, 6, 7, 8, 8, 9, 9, 9, 5, 10],
      [6, 6, 8, 8, 8, 10, 10, 10, 10, 10],
      [6, 8, 8, 8, 10, 10, 10, 10, 10, 10]
    ],
    attribution: "https://www.gmpuzzles.com/blog/2021/02/star-battle-by-jinhoo-ahn-4/"
  },
  "Thomas Snyder - 2 Stars 36:00": {
    stars: 2,
    size: 12,
    regions: [
      [1, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3],
      [1, 1, 1, 1, 4, 4, 2, 2, 2, 2, 3, 3],
      [5, 1, 5, 6, 6, 4, 4, 4, 4, 2, 2, 3],
      [5, 5, 5, 6, 4, 4, 7, 8, 4, 8, 2, 3],
      [5, 9, 9, 6, 7, 7, 7, 8, 8, 8, 2, 3],
      [5, 9, 6, 6, 6, 7, 7, 7, 8, 2, 2, 3],
      [5, 9, 9, 9, 6, 7, 10, 10, 8, 2, 3, 3],
      [5, 9, 11, 10, 10, 10, 10, 8, 8, 2, 3, 12],
      [5, 5, 11, 10, 11, 11, 10, 10, 2, 2, 3, 12],
      [5, 11, 11, 11, 11, 2, 2, 2, 2, 12, 3, 12],
      [5, 5, 5, 11, 2, 2, 12, 12, 12, 12, 3, 12],
      [5, 5, 11, 11, 2, 12, 12, 12, 12, 12, 12, 12]
    ],
    attribution: "https://www.gmpuzzles.com/blog/2020/12/star-battle-by-thomas-snyder-8/"
  },
  "Ashish Kumar - 2 Star 13:00": {
    stars: 2,
    size: 10,
    regions: [
      [1, 1, 1, 1, 1, 1, 1, 2, 2, 2],
      [1, 3, 3, 5, 1, 4, 4, 4, 4, 2],
      [1, 3, 3, 5, 5, 4, 4, 4, 4, 2],
      [1, 3, 3, 5, 5, 5, 5, 5, 2, 2],
      [1, 3, 3, 5, 5, 5, 5, 5, 2, 2],
      [1, 1, 6, 6, 6, 5, 5, 7, 7, 2],
      [1, 1, 6, 6, 6, 6, 6, 7, 7, 8],
      [1, 9, 9, 9, 9, 6, 6, 7, 7, 8],
      [10, 9, 9, 9, 9, 10, 10, 7, 7, 8],
      [10, 10, 10, 10, 10, 10, 8, 8, 8, 8]
    ],
    attribution: "https://www.gmpuzzles.com/blog/2021/02/star-battle-by-jinhoo-ahn-4/"
  },
  "Ashish Kumar - asdf:00": {
    stars: 2,
    size: 12,
    regions: [
      [1, 1, 1, 2, 2, 2, 2, 2, 2, 3, 3, 3],
      [1, 1, 4, 5, 5, 5, 2, 2, 2, 2, 3, 3],
      [1, 4, 4, 6, 6, 5, 5, 7, 7, 2, 2, 3],
      [1, 4, 4, 6, 6, 5, 5, 7, 7, 2, 2, 3],
      [1, 4, 6, 6, 6, 5, 5, 7, 7, 7, 2, 3],
      [1, 4, 6, 6, 5, 5, 5, 5, 7, 7, 2, 3],
      [1, 4, 5, 5, 5, 9, 9, 5, 5, 10, 2, 11],
      [1, 4, 5, 10, 9, 9, 9, 9, 10, 10, 2, 11],
      [1, 4, 12, 10, 10, 9, 9, 10, 10, 13, 2, 11],
      [1, 4, 12, 12, 10, 10, 10, 10, 13, 13, 2, 11],
      [1, 4],
      []
    ],
    attribution: "https://www.gmpuzzles.com/blog/2021/02/star-battle-by-jinhoo-ahn-4/"
  },
};

// make all the files in 'public' available
// https://expressjs.com/en/starter/static-files.html
app.use(express.static("public"));

// https://expressjs.com/en/starter/basic-routing.html
app.get("/", (request, response) => {
  response.sendFile(__dirname + "/views/index.html");
});

let globalBoard;

function initializeGlobalBoard(puzzleName) {
  const puzzle = puzzles[puzzleName];
  globalBoard = new Array(puzzle.size)
    .fill()
    .map((_, i) =>
      new Array(puzzle.size).fill().map((_, j) => ({ color: "", icon: "" }))
    );
}

initializeGlobalBoard(current_puzzle);

const snapshots = [];

function emitPuzzle(socket) {
  socket.emit("puzzle", puzzles[current_puzzle]);
}

function emitBoard(socket) {
  socket.emit("board", globalBoard);
}

function emitSnapshots(socket) {
  socket.emit("snapshots", snapshots);
}

function emitPuzzleSelection(socket) {
  socket.emit("puzzleSelection", {
    puzzleList: Object.keys(puzzles),
    currentPuzzle: current_puzzle
  });
}

io.on("connection", socket => {
  emitPuzzle(socket);
  emitBoard(socket);
  emitSnapshots(socket);
  emitPuzzleSelection(socket);

  socket.on("click", ({ row, column, action }) => {
    globalBoard = Immer.produce(globalBoard, board => {
      const square = board[row][column];
      switch (action) {
        case "star":
        case "cross":
          square.icon = square.icon === action ? "" : action;
          break;
        default:
          square.color = square.color === action ? "" : action;
          break;
      }
    });

    emitBoard(io);
  });

  socket.on("takeSnapshot", () => {
    snapshots.unshift(globalBoard);
    emitSnapshots(io);
  });

  socket.on("restoreSnapshot", board => {
    globalBoard = board;
    emitBoard(io);
  });

  socket.on("reset", () => {
    snapshots.splice(0, snapshots.length);
    initializeGlobalBoard(current_puzzle);
    emitBoard(io);
    emitSnapshots(io);
  });

  socket.on("choosePuzzle", puzzleName => {
    snapshots.splice(0, snapshots.length);
    current_puzzle = puzzleName;
    initializeGlobalBoard(current_puzzle);
    emitPuzzleSelection(io);
    emitSnapshots(io);
    emitPuzzle(io);
    emitBoard(io);
  });
});

const listener = server.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
