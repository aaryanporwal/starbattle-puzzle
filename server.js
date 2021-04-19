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

const state = {
  board: [
    [
      
    ],
    [
      
    ],
  ]
}

io.on('connection', (socket) => {
  console.log('a user connected');
  socket.on('offer', offer => {
    console.log(offer);
    io.emit('offer', offer);
  })
});

const listener = server.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
