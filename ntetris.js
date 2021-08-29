let width = 10;
let height = 30;

let P1 = 0;
let P2 = 1;

let BG = 2;
let TERR = 3;

let iPiece = [[1], [1], [1], [1]];
let tPiece = [[0, 1, 0], [1, 1, 1]];
let sPiece = [[0, 1, 1], [1, 1, 0]];
let zPiece = [[1, 1, 0], [0, 1, 1]];
let oPiece = [[1, 1], [1, 1]];
let lPiece = [[1, 0], [1, 0], [1, 0], [1, 1]];
let jPiece = [[0, 1], [0, 1], [0, 1], [1, 1]];

let pieces = [iPiece, tPiece, sPiece, zPiece, oPiece, lPiece, jPiece];

function newNtetrisGameState() {
    return {
        board: newNtetrisBoard(),
        players: [
            {
                piece: null,
            },
            {
                piece: null,
            }
        ]
    }
}

function newNtetrisBoard() {
    let array = Array.from({ length: height }, () => Array(width));
    for (x = 0; x < width; x++) {
        for (y = 0; y < height / 2; y++) {
            array[y][x] = P1;
        }
        for (y = height / 2; y < height; y++) {
            array[y][x] = P2;
        }
    }

    return array;
}

function stepState(state) {
    console.log('step game state');
    for (let i = 0; i <= 1; i++) {
        if (state.players[i].piece === null) {
            spawnPiece(state, i);
        }
    }
    console.log(state.players);
}

function performKeyPress(state, player, key) {
    let tryPiece = { ...state.players[player].piece };
    switch (key) {
        case 'left':
            tryPiece.x -= 1;
            break;
        case 'right':
            tryPiece.x += 1;
            break;
        case 'up':
            break;
        case 'space':
            break;
        case 'down':
            tryPiece.y += 1;
            break;
    }
    if (pieceIntersects(state, tryPiece)) {
        if (key === 'down') {
            lockPiece(state, player);
        }
    } else {
        state.players[player].piece = tryPiece;
    }
}

function lockPiece(state, player) {
    let piece = state.players[player].piece
    for (let y = 0; y < piece.h; y++) {
        for (let x = 0; x < piece.w; x++) {
            if (piece.shape[y][x] === 1) {
                setAs(state.board, piece.y + y, piece.x + x, player, TERR);
            }
        }
    }

    rowsToClear = [];
    for (let y = 0; y < piece.h; y++) {
        let completed = true;
        for (let x = 0; x < width; x++) {
            if (getAs(state.board, piece.y + y, x, player) === BG) {
                completed = false;
            }
        }
        if (completed) rowsToClear.push(piece.y + y);
    }
    state.players[player].piece = null;
}

function pieceIntersects(state, piece) {
    for (let y = 0; y < piece.h; y++) {
        for (let x = 0; x < piece.w; x++) {
            if (getAs(state.board, piece.y + y, piece.x + x, piece.player) === TERR) {
                return true;
            }
        }
    }
    return false;
}

function spawnPiece(state, player) {
    let piece = createPiece(player);
    state.players[player].piece = piece;
}

function createPiece(player) {
    let shape = pieces[Math.floor(Math.random() * pieces.length)];
    return {
        y: 0,
        x: 4,
        h: shape.length,
        w: shape[0].length,
        player: player,
        shape: shape,
    }
}

function getAs(board, y, x, player) {
    if (y < 0 || x < 0 || x >= width || y >= height) {
        return TERR;
    }
    if (player === P1) {
        return board[y][x] === P1 ? BG : TERR;
    } else {
        return board[height - y - 1][width - x - 1] === P1 ? TERR : BG;
    }
}

function setAs(board, y, x, player, value) {
    if (y < 0 || x < 0 || x >= width || y >= height) {
        return;
    }
    if (player === P1) {
        board[y][x] = value === BG ? P1 : P2;
    } else {
        board[height - y - 1][width - x - 1] = value === BG ? P2 : P1;
    }
}

module.exports = {
    newNtetrisGameState,
    stepState,
    performKeyPress,
    P1,
    P2
};