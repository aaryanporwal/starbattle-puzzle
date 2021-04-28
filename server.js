const Immer = require("immer");
const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const io = require("socket.io")(server);

let current_puzzle = "puzzle_2";
const puzzles = {
  puzzle_1: {
    stars: 1,
    size: 5,
    regions: [
      [0, 0, 1, 1, 1],
      [0, 0, 2, 2, 1],
      [3, 0, 2, 1, 1],
      [3, 3, 4, 4, 4],
      [3, 3, 3, 3, 3]
    ],
    borders: {
      rows: ["#|#||#", "#|#|##", "####|#", "#|#||#", "#||||#"],
      columns: ["#|#||#", "#||#|#", "##|###", "######", "#||###"]
    }
  },
  puzzle_2: {
    stars: 1,
    size: 5,
    regions: [
      [0, 0, 1, 1, 1],
      [0, 1, 1, 2, 2],
      [3, 1, 4, 2, 2],
      [3, 3, 4, 2, 2],
      [3, 3, 2, 2, 2]
    ],
    borders: {
      rows: ["#|#||#", "##|#|#", "####|#", "#|##|#", "#|#||#"],
      columns: ["#|#||#", "##|#|#", "#|#|##", "##|||#", "##|||#"]
    }
  }
};

// make all the files in 'public' available
// https://expressjs.com/en/starter/static-files.html
app.use(express.static("public"));

// https://expressjs.com/en/starter/basic-routing.html
app.get("/", (request, response) => {
  response.sendFile(__dirname + "/views/index.html");
});

let globalBoard = new Array(5)
  .fill()
  .map((_, i) =>
    new Array(5).fill().map((_, j) => ({ color: "white", icon: "" }))
  );

const clearGlobalBoard = () => {
  globalBoard = new Array(5)
    .fill()
    .map((_, i) =>
      new Array(5).fill().map((_, j) => ({ color: "white", icon: "" }))
    );
};

const snapshots = [];

io.on("connection", socket => {
  socket.emit("puzzle", puzzles[current_puzzle]);
  socket.emit("board", globalBoard);
  socket.emit("snapshots", snapshots);
  socket.emit("puzzle_list", Object.keys(puzzles));
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
    io.emit("board", globalBoard);
  });

  socket.on("takeSnapshot", () => {
    snapshots.unshift(globalBoard);

    io.emit("snapshots", snapshots);
  });

  socket.on("restoreSnapshot", board => {
    // snapshots.push(globalBoard);
    globalBoard = board;
    io.emit("board", globalBoard);
    io.emit("snapshots", snapshots);
  });

  socket.on("reset", () => {
    snapshots.splice(0, snapshots.length);
    clearGlobalBoard();
    io.emit("snapshots", snapshots);
    io.emit("board", globalBoard);
  });
});

const listener = server.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
