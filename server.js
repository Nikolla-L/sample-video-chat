const express = require('express');

const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const { v4: uuidv4 } = require('uuid');
const { ExpressPeerServer } = require('peer');

const peerServer = ExpressPeerServer(server, {debug: true});

app.use(express.static('public'));
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    // res.render('room');
    res.redirect(`/${uuidv4()}`);
});
app.get('/:room', (req, res) => {
    res.render('room', { roomId: req.param.room });
});

io.on('connection', socket => {
    socket.on('join-room', (roomId, userId) => {
        socket.join(roomId);
        socket.to(roomId).broadcast.emit('user-connected', userId);
    })
});

server.listen(3001, () => {
    console.log('server is running on port 3001');
});