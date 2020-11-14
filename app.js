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
    if (Boolean(buzzInterval)) {
      clearInterval(buzzInterval);
    }
    isBuzzing = true;
    socket.emit('buzzing');
    buzzInterval = setInterval(() => {
      isBuzzing = false;
      socket.emit('clear');
    }, 5000);
  });

  // handle the event sent with socket.send()
  socket.on('message', (data) => {
    console.log(data);
  });

  // handle the event sent with socket.emit()
  socket.on('salutations', (elem1, elem2, elem3) => {
    console.log(elem1, elem2, elem3);
  });
});


app.use(express.static(__dirname + "/client"));
app.all("*", function (req, res) {
    res.redirect("/");
});

module.exports = app;
