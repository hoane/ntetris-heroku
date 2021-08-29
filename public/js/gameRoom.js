class GameRoomScene extends Phaser.Scene {
    constructor(config) {
        super({
            ...config,
            key: 'game-room-scene'
        });
    }

    font = { fontSize: '24px', fontFamily: 'FreeMono, monospace' };
    roomState = {}

    init(data) {
        this.roomState = {
            roomCode: data.roomCode || '',
            phase: 'client-init'
        };
        this.createRoom = data.createRoom === 'true';
    }

    preload() {

    }

    create(_data) {
        let self = this;
        let { width, height } = this.scale;
        this.roomCodeText = this.add.text(10, 10, 'ROOM:', this.font);
        this.roomStateText = this.add.text(260, 10, '', this.font);

        self.socket = io();

        self.socket.on('accepted', function ({ id: id }) {
            console.log('connection accepted by server. I am ' + id);
            self.serverId = id;

            if (self.createRoom) {
                self.socket.emit('create-room');
            } else {
                self.socket.emit('join-room', { roomCode: self.roomState.roomCode })
            }
        });

        self.socket.on('room-join-fail', function ({ message: message }) {
            console.log(message);
            self.scene.start('main-menu-scene', { 'message': message });
        });

        self.socket.on('room-state-update', function ({ roomState: roomState }) {
            console.log('hi');
            self.roomState = roomState;
        });
    }

    update(_time, _delta) {
        this.roomCodeText.setText('ROOM: ' + this.roomState.roomCode);

        let roomStateTextVal = ''
        if (this.roomState.phase === 'client-init') {
            if (this.createRoom) {
                roomStateTextVal = 'Creating room...';
            } else {
                roomStateTextVal = 'Joining room...';
            }
        } else if (this.roomState.phase === 'waiting') {
            roomStateTextVal = 'Waiting for opponent...';
        } else if (this.roomState.phase === 'playing') {
            roomStateTextVal = 'Play';
        }
        this.roomStateText.setText(roomStateTextVal);
    }
}