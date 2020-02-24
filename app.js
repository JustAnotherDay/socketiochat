const express = require('express');
const http = require('http');

const app = express();
var server = http.Server(app)
var io = require('socket.io')(server);
const port = process.env.PORT || 3333;
const www = process.env.WWW || './';

app.use(express.static(www));
console.log(`serving ${www}`);

app.get('*', (req, res) => {
    res.sendFile(`index.html`, { root: www });
});

server.listen(port, () => console.log(`listening on http://localhost:${port}`));
var users= [];
io.on("connection", function (socket) {
    var name = "";
    socket.on("has connected", function (username) {
        name = username;
        users.push(username);
        io.emit("has connected", { username: username, usersList: users });
    });

    socket.on("disconnect", function () {
        users.splice(users.indexOf(name), 1);
        console.log(users);
        io.emit("has disconnected", { username: name, usersList: users });
    });

    socket.on("new message", function (message) {
        console.log(message);
        io.emit("new message", message);
    });
});
