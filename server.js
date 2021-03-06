const express = require('express');
const app = express();
const http = require("http");
const server = http.createServer(app);
const cors = require('cors');

const io = require("socket.io")(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST'],
    }
});


const PORT = process.env.PORT || 5000;

app.get('/', (req, res) => {
    res.send("Server is running."); 
});

io.on("connection", (socket) => {
    socket.emit("me", socket.id);
    socket.on("disconnect", () => {
        socket.broadcast.emit("callended");
    });
    socket.on("call user", ({ userToCall, signalData, from, name }) => {
        io.to(userToCall).emit("calluser", { signal: signalData, from, name });
    })
    socket.on("answercall", (data) => {
        io.to(data.to).emit("callaccepted", data.signal);
    });
});

server.listen(PORT, () => console.log("listening"));