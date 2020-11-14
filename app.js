const port = process.env.PORT || 8000;
var express = require('express');
var app = express();
const server = require('http').createServer(app);
var io = require('socket.io')(server);

server.listen(port, function () {
  console.log("Server running at port %s", port);
});

let buzzInterval;

io.on('connection', socket => {
  socket.join('everyone');
  function buzz() {
    io.to('everyone').emit('buzzing');
    buzzInterval = setInterval(() => {
      io.to('everyone').emit('clear');
    }, 2000);
  }
  socket.on('buzz', () => {
    if (buzzInterval) {
      clearInterval(buzzInterval);
    }
    buzz();
  });
});


app.use(express.static(__dirname + "/client"));
app.all("*", function (req, res) {
    res.redirect("/");
});

module.exports = app;
