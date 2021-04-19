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

const board = new Array(5).fill().map((_, i) => {
  return new Array(5).fill().map((_, j) => {
    if (i === 2 && j === 3) {
      return { color: 'white', icon: 'star' }
    } else if (i === 4 && j === 1) {
      return { color: 'green', icon: '' }
    } else
      return { color: 'white', icon: '' }
  });
});

io.on('connection', (socket) => {
  socket.emit('state', {
    board
  });
});

const listener = server.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
