const express = require('express');
const { createServer } = require('http');
const app = express();
const { Server } = require('socket.io');
const cors = require('cors');
const { User, Room, Message, RoomMember } = require('./models');
const messageRoutes = require('./messageRoutes');

app.use(cors());

const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: ['http:localhost:5000', 'http://127.0.0.1:5500']
    }
});

io.on('connection', (socket) => {

    console.log(socket.id, ': connected');

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

    socket.on('joinRoom', async(data) => {
        let minUserId = Math.min(data.fromUser, data.toUser);
        let maxUserId = Math.max(data.fromUser, data.toUser);
        const roomName = `${minUserId}_${maxUserId}`;
        
        console.log(socket.id, 'Jonin To Room: ', roomName);

        const existsRoom = await Room.findOne({
            where: { chatId: roomName }
        });

        if(!existsRoom){
            const room =  await Room.create({
                chatId: roomName,
                name: roomName
            });

            const roomMembers = [
                { userId: minUserId, roomId: room.id },
                { userId: maxUserId, roomId: room.id },
            ];

            await RoomMember.bulkCreate(roomMembers);
        }
        
        socket.join(roomName);
    });

    // users part
    socket.on('sendMessage', async (data) => {
        console.log('listen on send message ...');
        
        if(data.user){
            
            const foundUser = await User.findByPk(data.user.id);
            if(foundUser){
                if(data.toUser){
                    let minUserId = Math.min(foundUser.id, data.toUser);
                    let maxUserId = Math.max(foundUser.id, data.toUser);
                    const roomName = `${minUserId}_${maxUserId}`;

                    socket.to(roomName).emit('chat_message', data.message);

                    const room = await Room.findOne({
                        where: { chatId: roomName }
                    });

                    await Message.create({
                        userId: foundUser.id,
                        roomId: room?.id,
                        message: data.message
                    });
                }
                else{
                    console.log(socket.id, 'There is no users with this id ...');
                }
            }
            else{
                socket.emit('chat_message', 'Unauthorized user ...');
                console.log(socket.id, 'Unauthorized user ...');
            }
        }
        else{
            console.log(socket.id, 'Unauthorized user .....');
        }
    });

    socket.on('disconnect', () => {
        console.log(socket.id, ': disconnected');
    });

});

app.use('/api', messageRoutes);

httpServer.listen(3000, () => {
    console.log('Server is running on port: 3000');
})