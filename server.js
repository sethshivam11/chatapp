const { Server } = require('socket.io');
const express = require("express");
const app = express();
const path = require("path");
const __dirname1 = path.resolve();
const cors = require('cors');
app.use(cors());

app.use(express.static(path.join(__dirname1, "/build")));
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname1, "build", "index.html"));
});

const io = new Server({
  cors: {
    origin: "http://localhost",
    methods: ["GET", "POST"],
}
});
const users = {};


io.on('connection', (socket) => {
    socket.on('new-user-joined', name => {
        users[socket.id] = name;
        socket.broadcast.emit('user-joined', name);
    });
    socket.on('send', message => {
        socket.broadcast.emit('recieve', {message: message, name: users[socket.id]});
    });
    socket.on('disconnect', name => {
        socket.broadcast.emit('left', users[socket.id]);
        delete users[socket.id];
    });
})
io.listen(5000, console.log("Server is running"));
app.listen(80, () => {
  console.log("App is listening at port 80");
});