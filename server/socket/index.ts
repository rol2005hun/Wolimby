import { Server, Socket } from 'socket.io';

interface MySocket extends Socket {
    uid?: string;
}

export default function setupSocket(server: any) {
    const io = new Server(server, { cors: { origin: '*' } });

    io.on('connection', (socket: MySocket) => {
        socket.on('connection', (id) => {
            socket.uid = id;
            const onlineUsers = (Array.from(io.sockets.sockets.values()) as MySocket[]).map(e => e.uid);
            io.sockets.emit('connection', onlineUsers);
        });

        socket.on('newChat', (chat, uid) => {
            socket.broadcast.emit('receiveChat', chat, uid);
        });

        socket.on('editChat', (chatid, chat) => {
            socket.broadcast.emit('editChat', chatid, chat);
        });

        socket.on('sendMessage', (message, id, uid) => {
            socket.broadcast.emit('receiveMessage', message, id, uid);
        });

        socket.on('mention', (chatId, userId) => {
            socket.broadcast.emit('mention', chatId, userId);
        });

        socket.on('typing', (userId, chatId, typing) => {
            socket.broadcast.emit('typing', userId, chatId, typing);
        });

        socket.on('deleteChat', (chatId) => {
            socket.broadcast.emit('deleteChat', chatId);
        });

        socket.on('disconnect', () => {
            socket.broadcast.emit('disconnection', socket.uid);
        });
    });
}