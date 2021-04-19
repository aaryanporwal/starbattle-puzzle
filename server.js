const express = require("express");
const app = express();
const http = require('http');
const server = http.createServer(app);
const io = require('socket.io')(server);

// make all the files in 'public' available
// https://expressjs.com/en/starter/static-files.html
app.use(express.static("public"));

// https://expressjs.com/en/starter/basic-routing.html
app.get("/", (request, response) => {
  response.sendFile(__dirname + "/views/index.html");
});

const board = new Array(5).fill().map((_, i) =>
  new Array(5).fill().map((_, j) =>
    ({ color: 'white', icon: '' })
  )
)

io.on('connection', (socket) => {
  socket.emit('state', { board });

  socket.on('click', ({ row, column, action }) => {
    const square = board[row][column];
    switch (action) {
      case 'star':
      case 'cross':
        square.icon = square.icon === action ? '' : action;
        break;
      default:
        square.color = square.color === action ? '' : action;
        break;
    }
    io.emit('state', { board });
  });
});

const listener = server.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
