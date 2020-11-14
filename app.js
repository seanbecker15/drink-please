const port = process.env.PORT || 8000;
var express = require('express');
var app = express();
const server = require('http').createServer(app);
var io = require('socket.io')(server);

server.listen(port, function () {
  console.log("Server running at port %s", port);
});

let isBuzzing = false;
let buzzInterval;

io.on('connection', socket => {
  // either with send()
  socket.send('Hello!');

  socket.emit('test', { a: 'example'});

  socket.on('buzz', () => {
    if (Boolean(isBuzzing)) {
      clearInterval(buzzInterval);
    }
    isBuzzing = true;
    socket.emit('buzzing');
    buzzInterval = setInterval(() => {
      isBuzzing = false;
      socket.emit('clear');
    }, 5000);
  });

});


app.use(express.static(__dirname + "/client"));
app.all("*", function (req, res) {
    res.redirect("/");
});

module.exports = app;
