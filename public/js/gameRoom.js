let gameWidth = 10;
let gameHeight = 30;
let tileSize = 32;
let P1 = 0;
let P2 = 1;
let P1P = 2;
let P2P = 3;

class GameRoomScene extends Phaser.Scene {
    constructor(config) {
        super({
            ...config,
            key: 'game-room-scene'
        });
    }

    font = { fontSize: '24px', fontFamily: 'FreeMono, monospace' };
    roomState = {}
    boardUpdated = false;

    init(data) {
        this.roomState = {
            roomCode: data.roomCode || '',
            phase: 'client-init'
        };
        this.createRoom = data.createRoom === 'true';
    }

    preload() {
		this.load.image('bg-1', 'assets/tetris_bg_1.png');
		this.load.image('bg-2', 'assets/tetris_bg_2.png');
		this.load.image('bg-3', 'assets/tetris_bg_3.png');
		this.load.image('piece-2', 'assets/tetris_piece_1.png');
		this.load.image('piece-1', 'assets/tetris_piece_2.png');
    }

    create(_data) {
        let self = this;
        let { width, height } = this.scale;
        this.roomCodeText = this.add.text(5, 5, 'ROOM:', this.font);
        this.roomStateText = this.add.text(260, 5, '', this.font);

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
            self.boardUpdated = true;
        });

        let baseBoardX = width / 2 - 4 * tileSize - tileSize / 2;
        let baseBoardY = 50;
        this.gameImages = [];
        this.gameImageGroup = this.add.group();
        for (let y = 0; y < gameHeight; y++) {
            this.gameImages[y] = [];
            for (let x = 0; x < gameWidth; x++) {
                this.gameImages[y][x] = this.add.image(baseBoardX + x * tileSize, baseBoardY + y * tileSize, 'bg-3');
                this.gameImageGroup.add(this.gameImages[y][x]);
            }
        }
        this.gameImageGroup.add(
            this.add.line(0, 0, 120, baseBoardY + 3.5 * tileSize, width - 120, baseBoardY + 3.5 * tileSize, '0xff0000')
                .setOrigin(0, 0)
        )
        this.gameImageGroup.add(
            this.add.line(0, 0, 120, baseBoardY + (gameHeight - 4.5) * tileSize, width - 120, baseBoardY + (gameHeight - 4.5) * tileSize, '0xff0000')
                .setOrigin(0, 0)
        )
        //this.gameImageGroup.setVisible(false);

        function registerKey(key, memo) {
            let keyReg = self.input.keyboard.addKey(key);
            keyReg.on('down', function (event) {
                self.socket.emit('key-press', { key: memo });
            });
        }

        registerKey(Phaser.Input.Keyboard.KeyCodes.SPACE, 'space');
        registerKey(Phaser.Input.Keyboard.KeyCodes.UP, 'up');
        registerKey(Phaser.Input.Keyboard.KeyCodes.DOWN, 'down');
        registerKey(Phaser.Input.Keyboard.KeyCodes.LEFT, 'left');
        registerKey(Phaser.Input.Keyboard.KeyCodes.RIGHT, 'right');
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

        if (this.roomState.phase === 'playing' && this.boardUpdated === true) {
            this.gameImageGroup.setVisible(true);
            let player = this.roomState.players[0] === this.serverId ? P1 : P2;
            let board = getRealizedBoard(this.roomState.gameState, player);

            for (let y = 0; y < gameHeight; y++) {
                for (let x = 0; x < gameWidth; x++) {
                    let imageKey
                    switch (board[y][x]) {
                        case P1:
                            imageKey = 'bg-1';
                            break;
                        case P2:
                            imageKey = 'bg-2';
                            break;
                        case P1P:
                            imageKey = 'piece-1';
                            break;
                        case P2P:
                            imageKey = 'piece-2';
                            break;
                    }
                    this.gameImages[y][x].setTexture(imageKey);
                }
            }
            this.boardUpdated = false;
        }
    }
}

function getRealizedBoard(state, player) {
    let myBG = player === P1 ? P1 : P2;
    let array = Array.from({ length: gameHeight }, () => Array(gameWidth));
    for (y = 0; y < gameHeight; y++) {
        for (x = 0; x < gameWidth; x++) {
            let val = player === P1 ? state.board[y][x] : state.board[gameHeight - y - 1][gameWidth - x - 1]
            array[y][x] = val === myBG ? P1 : P2;
        }
    }

    let piece = state.players[player === P1 ? 0 : 1].piece;
    if (piece) {
        for (let y = 0; y < piece.h; y++) {
            for (let x = 0; x < piece.w; x++) {
                if (piece.shape[y][x] === 1) {
                    array[piece.y + y][piece.x + x] = P1P;
                }
            }
        }
    }

    piece = state.players[player === P1 ? 1 : 0].piece;
    if (piece) {
        for (let y = 0; y < piece.h; y++) {
            for (let x = 0; x < piece.w; x++) {
                if (piece.shape[y][x] === 1) {
                    array[gameHeight - (piece.y + y) - 1][gameWidth - (piece.x + x) - 1] = P2P;
                }
            }
        }
    }

    return array;
}