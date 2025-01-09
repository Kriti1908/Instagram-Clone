import {Server} from 'socket.io';
import http from 'http';
import express from 'express';

const app = express();

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: 'http://localhost:5173',
        methods: ['GET', 'POST'],
    }
});

const userSocketMap = {};       //store socket id of each user

export const getRecieverSocketId = (receiverId) => {
    return userSocketMap[receiverId];
}

io.on('connection', (socket) => {
    const userId = socket.handshake.query.userId;
    if(userId){
        userSocketMap[userId] = socket.id;
        console.log(`User connected: userid: ${userId}, socketid: ${socket.id}`);
    }

    io.emit('getOnlineUsers', Object.keys(userSocketMap));

    socket.on('disconnect', () => {
        if(userId){
            delete userSocketMap[userId];
            console.log(`User disconnected: userid: ${userId}, socketid: ${socket.id}`);
        }
        io.emit('getOnlineUsers', Object.keys(userSocketMap));
    });
});

export {app, server, io};