const express = require('express');
const { createServer } = require('http');
const app = express();
const { Server } = require('socket.io');
const cors = require('cors');

app.use(cors());

const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: ['http:localhost:5000', 'http://127.0.0.1:5500']
    }
});

io.on('connection', (socket) => {
    console.log(socket.id, ' has been connected ...');

    socket.on('typing', () => {
        socket.broadcast.emit('status_typing');
    });

    socket.on('stop_typing', () => {
        socket.broadcast.emit('status_reading')
    });

    socket.on('new_text', (message) => {
        console.log(socket.id, message);
        
        io.emit('chat_message', message);
    });
    
    socket.on('disconnect', () => {
        console.log(socket.id, ' has been disconnected ...')
    });
});

httpServer.listen(3000, () => {
    console.log('Server is running on port: 3000');
})