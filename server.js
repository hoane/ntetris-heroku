var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

var players = {}
var rooms = {}

app.use(express.static(__dirname + '/public'));
app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', function (socket) {
    console.log('a user connected');
    players[socket.id] = {
        roomCode: null
    };

    socket.emit('accepted', { id: socket.id });

    socket.on('create-room', function () {
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
    });

    socket.on('join-room', function ({ roomCode: roomCode }) {
        console.log('user requested to join room ' + roomCode);
        let success = false;
        let message = '';
        if (roomCode in rooms) {
            if (rooms[roomCode].phase === 'waiting') {
                if (rooms[roomCode].players.length === 1) {
                    rooms[roomCode].players.push(socket.id);
                    rooms[roomCode].phase = 'playing';
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
    })
    /*
    players[socket.id] = {
        rotation: 0,
        x: Math.floor(Math.random() * 700) + 50,
        y: Math.floor(Math.random() * 500) + 50,
        playerId: socket.id,
        team: (Math.floor(Math.random() * 2) == 0) ? 'red' : 'blue'
    };
    // send the players object to the new player
    socket.emit('currentPlayers', players);
    // update all other players of the new player
    socket.broadcast.emit('newPlayer', players[socket.id]);

    // when a player moves, update the player data
    socket.on('playerMovement', function (movementData) {
        players[socket.id].x = movementData.x;
            players[sockephat.id].y = movementData.y;
        players[socket.id].rotation = movementData.rotation;
        // emit a message to all players about the player that moved
        socket.broadcast.emit('playerMoved', players[socket.id]);
    });

    socket.on('disconnect', function () {
        console.log('user disconnected');
        // remove this player from our players object
        delete players[socket.id];
        // emit a message to all players to remove this player
        io.emit('disconnectPlayer', socket.id);
    });
    */
    socket.on('disconnect', function () {
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
    });
});

server.listen(process.env.PORT || 8082, function () {
    console.log(`Listening on ${server.address().port}`);
});

function randomRoomCode() {
    return (Math.floor(Math.random() * 9000.0) + 1000).toString();
}