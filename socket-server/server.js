import express from 'express';
import http from 'http';
import { Server } from "socket.io";

const app = express();
const PORT = process.env.PORT || 3000;

const server = http.createServer();

const ioServer = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

let clients = {};

ioServer.on('connection', (client) => {
    console.log(`User ${client.id} connected, with ${ioServer.engine.clientsCount} other(s)..`);
    // add a new client indexed by ID
    clients[client.id] = {
        username: `user${client.id}`,
        position: [0,0,0],
        rotation: [0,0,0]
    }
    ioServer.sockets.emit('userJoined', clients[client.id]);

    ioServer.sockets.emit('move', clients);
    client.on('move', ({id, rotation, position, username}) => {
        clients[id].username = username,
        clients[id].position = position,
        clients[id].rotation = rotation

        ioServer.sockets.emit('move', clients);
    });

    client.on('disconnect', (reason) => {
        console.log(`${client.id} disconnected. Reason: ${reason}. ${ioServer.engine.clientsCount} user(s) still connected.`);
        // delete disconnected user from object
        delete clients[client.id];

        ioServer.sockets.emit('move', clients);
    })
})

server.listen(PORT, () => console.log(`Server is running on http://localhost:${PORT}..`))
