var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var ntetris = require('./ntetris');

var players = {}
var rooms = {}

app.use(express.static(__dirname + '/public'));
app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

function serverTick() {
    for (roomCode in rooms) {
        if (rooms[roomCode].phase === 'playing') {
            if (rooms[roomCode].gameState) {
                if (ntetris.stepState(rooms[roomCode].gameState)) {
                    rooms[roomCode].phase = 'end';
                }
                rooms[roomCode].players.forEach(id => {
                    io.to(id).emit('room-state-update', { roomState: rooms[roomCode] });
                });
            }
        }
    }
}

function createRoom() {
    let roomCode = randomRoomCode();
    rooms[roomCode] = {
        roomCode: roomCode,
        players: [socket.id],
        phase: 'waiting'
    };
    players[socket.id].roomCode = roomCode;
    console.log(players[socket.id]);
    console.log('created room ' + roomCode);
    socket.emit('room-state-update', { roomState: rooms[roomCode] });
}

function joinRoom({ roomCode: roomCode }) {
    console.log('user requested to join room ' + roomCode);
    let success = false;
    let message = '';
    if (roomCode in rooms) {
        if (rooms[roomCode].phase === 'waiting') {
            if (rooms[roomCode].players.length === 1) {
                rooms[roomCode].players.push(socket.id);
                rooms[roomCode].phase = 'playing';
                rooms[roomCode].gameState = ntetris.newNtetrisGameState();
                players[socket.id].roomCode = roomCode;
                success = true;
            } else {
                message = 'Wrong number of players in room';
            }
        } else {
            message = 'Room is not waiting for players';
        }
    } else {
        message = 'Room does not exist';
    }
    
    if (success) {
        rooms[roomCode].players.forEach(id => {
            io.to(id).emit('room-state-update', { roomState: rooms[roomCode] });
        });
    } else {
        socket.emit('room-join-fail', { message: message });
    }
}

function handleKeyPress({ key: key }) {
    let roomCode = players[socket.id].roomCode;

    if (roomCode in rooms) {
        if (rooms[roomCode].phase === 'playing') {
            let player = rooms[roomCode].players[0] === socket.id ? ntetris.P1 : ntetris.P2;
            ntetris.performKeyPress(rooms[roomCode].gameState, player, key);
        }
    }
}

function handleDisconnect() {
    console.log('user disconnected');
    if (socket.id in players) {
        let roomCode = players[socket.id].roomCode
        if (roomCode && roomCode in rooms) {
            console.log('deleting room ' + roomCode);
            rooms[roomCode].players.forEach(id => {
                if (id !== socket.id) {
                    io.to(id).emit("disconnect-player", id);
                }
            });
            delete rooms[roomCode];
        }
        delete players[socket.id];
    }
}

io.on('connection', function (socket) {
    console.log('a user connected');
    players[socket.id] = {
        roomCode: null
    };

    socket.emit('accepted', { id: socket.id });

    socket.on('create-room', createRoom);
    socket.on('join-room', joinRoom);
    socket.on('key-press', handleKeyPress);
    socket.on('disconnect', handleDisconnect);
});

server.listen(process.env.PORT || 8082, function () {
    console.log(`Listening on ${server.address().port}`);
});

setInterval(serverTick, 100);

function randomRoomCode() {
    return (Math.floor(Math.random() * 9000.0) + 1000).toString();
}