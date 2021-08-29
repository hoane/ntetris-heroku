let width = 10;
let height = 30;

let P1 = 0;
let P2 = 1;

let BG = 2;
let TERR = 3;

let S = 0;
let R = 1;
let F = 2;
let L = 3;

function k(x, y) { return { x: x, y: y } }

let noWallKicksFlat = [k(0, 0)];

let noWallKicks = {
    0: {
        1: [k(0, 0)],
        3: [k(0, 0)]
    },
    1: {
        2: [k(0, 0)],
        0: [k(0, 0)]
    },
    2: {
        3: [k(0, 0)],
        1: [k(0, 0)]
    },
    3: {
        0: [k(0, 0)],
        2: [k(0, 0)]
    }
}

let wallkicks = {
    0: {
        1: [k(0, 0), k(-1, 0), k(-1, 1), k(0, -2), k(-1, -2)],
        3: [k(0, 0), k(1, 0), k(1, 1), k(0, -2), k(1, -2)]
    },
    1: {
        2: [k(0, 0), k(1, 0), k(1, -1), k(0, 2), k(1, 2)],
        0: [k(0, 0), k(1, 0), k(1, -1), k(0, 2), k(1, 2)]
    },
    2: {
        3: [k(0, 0), k(1, 0), k(1, 1), k(0, -2), k(1, -2)],
        1: [k(0, 0), k(-1, 0), k(-1, 1), k(0, -2), k(-1, -2)]
    },
    3: {
        0: [k(0, 0), k(-1, 0), k(-1, -1), k(0, 2), k(-1, 2)],
        2: [k(0, 0), k(-1, 0), k(-1, -1), k(0, 2), k(-1, 2)]
    }
};

let iWallkicks = {
    0: {
        1: [k(0, 0), k(-2, 0), k(1, 0), k(-2, -1), k(1, 2)],
        3: [k(0, 0), k(-1, 0), k(2, 0), k(-1, 2), k(2, -1)]
    },
    1: {
        2: [k(0, 0), k(-1, 0), k(2, 0), k(-1, 2), k(2, -1)],
        0: [k(0, 0), k(2, 0), k(-1, 0), k(2, 1), k(-1, -2)]
    },
    2: {
        3: [k(0, 0), k(2, 0), k(-1, 0), k(2, 1), k(-1, -2)],
        1: [k(0, 0), k(1, 0), k(-2, 0), k(1, -2), k(-2, 1)]
    },
    3: {
        0: [k(0, 0), k(1, 0), k(-2, 0), k(1, -2), k(-2, 1)],
        2: [k(0, 0), k(-2, 0), k(1, 0), k(-2, -1), k(1, 2)]
    }
};

let pieces = [
    // I
    {
        rotations: [
            [[0, 0, 0, 0], [1, 1, 1, 1], [0, 0, 0, 0], [0, 0, 0, 0]],
            [[0, 0, 1, 0], [0, 0, 1, 0], [0, 0, 1, 0], [0, 0, 1, 0]],
            [[0, 0, 0, 0], [0, 0, 0, 0], [1, 1, 1, 1], [0, 0, 0, 0]],
            [[0, 1, 0, 0], [0, 1, 0, 0], [0, 1, 0, 0], [0, 1, 0, 0]]
        ],
        wallkicks: iWallkicks
    },
    // J
    {
        rotations: [
            [[1, 0, 0], [1, 1, 1], [0, 0, 0]],
            [[0, 1, 1], [0, 1, 0], [0, 1, 0]],
            [[0, 0, 0], [1, 1, 1], [0, 0, 1]],
            [[0, 1, 0], [0, 1, 0], [1, 1, 0]]
        ],
        wallkicks: wallkicks
    },
    // L
    {
        rotations: [
            [[0, 0, 1], [1, 1, 1], [0, 0, 0]],
            [[0, 1, 0], [0, 1, 0], [0, 1, 1]],
            [[0, 0, 0], [1, 1, 1], [1, 0, 0]],
            [[1, 1, 0], [0, 1, 0], [0, 1, 0]]
        ],
        wallkicks: wallkicks
    },
    // O
    {
        rotations: [
            [[1, 1], [1, 1]],
            [[1, 1], [1, 1]],
            [[1, 1], [1, 1]],
            [[1, 1], [1, 1]]
        ],
        wallkicks: noWallKicks
    },
    // S
    {
        rotations: [
            [[0, 1, 1], [1, 1, 0], [0, 0, 0]],
            [[0, 1, 0], [0, 1, 1], [0, 0, 1]],
            [[0, 0, 0], [0, 1, 1], [1, 1, 0]],
            [[1, 0, 0], [1, 1, 0], [0, 1, 0]]
        ],
        wallkicks: wallkicks
    },
    // T
    {
        rotations: [
            [[0, 1, 0], [1, 1, 1], [0, 0, 0]],
            [[0, 1, 0], [0, 1, 1], [0, 1, 0]],
            [[0, 0, 0], [1, 1, 1], [0, 1, 0]],
            [[0, 1, 0], [1, 1, 0], [0, 1, 0]]
        ],
        wallkicks: wallkicks
    },
    // Z
    {
        rotations: [
            [[1, 1, 0], [0, 1, 1], [0, 0, 0]],
            [[0, 0, 1], [0, 1, 1], [0, 1, 0]],
            [[0, 0, 0], [1, 1, 0], [0, 1, 1]],
            [[0, 1, 0], [1, 1, 0], [1, 0, 0]]
        ],
        wallkicks: wallkicks
    }
];

function newNtetrisGameState() {
    let state = {
        board: newNtetrisBoard(),
        gravity: 16,
        gravityIncreaseTime: 100,
        gravityIncreaseTicks: 0,
        players: [
            {
                gravityTicks: 0,
                piece: null,
                drop: false
            },
            {
                gravityTicks: 0,
                piece: null,
                drop: false
            }
        ],
        winner: null
    };
    for (let i = 0; i <= 1; i++) {
        spawnPiece(state, i);
    }
    return state;
}

function newNtetrisBoard() {
    let array = Array.from({ length: height }, () => Array(width));
    for (x = 0; x < width; x++) {
        for (y = 0; y < height; y++) {
            array[y][x] = y < height / 2 ? P1 : P2;
        }
    }

    for (x = 0; x < 3; x++) {
        let y = x < width / 2 ? height / 2 - 1 : height / 2; 
        array[y][x] = x < width / 2 ? P2 : P1;
    }

    for (x = width - 3; x < width; x++) {
        let y = x < width / 2 ? height / 2 - 1 : height / 2; 
        array[y][x] = x < width / 2 ? P2 : P1;
    }

    return array;
}

function stepState(state) {
    if (state.gravity > 2) {
        state.gravityIncreaseTicks--;
        if (state.gravityIncreaseTicks <= 0) {
            state.gravity--;
            state.gravityIncreaseTicks = state.gravityIncreaseTime;
        }
    }

    let endGame = false;
    for (i = 0; i <= 1; i++) {
        state.players[i].gravityTicks -= state.players[i].drop ? state.gravity : 1;
        if (state.players[i].gravityTicks <= 0) {
            state.players[i].gravityTicks = state.gravity;
            if (!tryMovePlacePiece(state, state.players[i].piece, 0, 1)) {
                endGame |= lockPiece(state, i);
            }
        }
    }
    return endGame;
}

function tryPlacePiece(state, piece, wallkicks) {
    for (let {x: x, y: ny} of wallkicks) {
        let y = -ny;
        let tryPiece = { ...piece };
        tryPiece.x += x;
        tryPiece.y += y;

        if (!pieceIntersects(state, tryPiece)) {
            state.players[piece.player].piece = tryPiece;
            return true;
        }
    };
    return false;
}

function tryMovePlacePiece(state, piece, x, y) {
    let tryPiece = { ...piece };
    tryPiece.x += x;
    tryPiece.y += y;
    return tryPlacePiece(state, tryPiece, noWallKicksFlat);
}

function tryRotatePlacePiece(state, piece, cw) {
    let tryPiece = { ...piece };
    let currentRotation = tryPiece.r;
    let targetRotation = (currentRotation + (cw ? 1 : -1) + 4) % 4;
    tryPiece.r = targetRotation;
    let wallkicks = tryPiece.wallkicks[currentRotation][targetRotation];
    return tryPlacePiece(state, tryPiece, wallkicks);
}



function performKeyPress(state, player, key) {
    let piece = state.players[player].piece
    switch (key) {
        case 'left':
            tryMovePlacePiece(state, piece, -1, 0);
            break;
        case 'right':
            tryMovePlacePiece(state, piece, 1, 0);
            break;
        case 'rotate-cw':
            tryRotatePlacePiece(state, piece, true);
            break;
        case 'rotate-ccw':
            tryRotatePlacePiece(state, piece, false);
            break;
        case 'drop-held':
            state.players[player].drop = true;
            break;
        case 'drop-released':
            state.players[player].drop = false;
            break;
        default:
            return;
    }
}

function lockPiece(state, player) {
    let piece = state.players[player].piece;
    let shape = piece.rotations[piece.r];
    for (let y = 0; y < piece.h; y++) {
        for (let x = 0; x < piece.w; x++) {
            if (shape[y][x] === 1) {
                setAs(state.board, piece.y + y, piece.x + x, player, TERR);
            }
        }
    }

    rowsToClear = [];
    for (let y = 0; y < piece.h; y++) {
        let hasBlock = false;
        for (let x = 0; x < piece.w; x++) {
            if (shape[y][x] === 1) {
                hasBlock = true;
            }
        }
        if (hasBlock) {
            let completed = true;
            for (let x = 0; x < width; x++) {
                if (getAs(state.board, piece.y + y, x, player) === BG) {
                    completed = false;
                }
            }
            if (completed) rowsToClear.push(piece.y + y);
        }
    }

    rowsToClear.forEach((r, i) => {
        let row = r + i;
        for (let y = row; y > 0; y--) {
            for (let x = 0; x < width; x++) {
                let upVal = getAs(state.board, y - 1, x, player);
                setAs(state.board, y, x, player, upVal);
            }
        }
    });

    let otherPlayer = piece.player === P1 ? P2 : P1;
    forcePieceOnBG(state, state.players[otherPlayer].piece);

    let endPlayer = checkGameEnd(state);
    if (endPlayer !== -1) {
        state.winner = endPlayer === P1 ? P2 : P1;
        return true;
    } else {
        state.players[player].piece = null;
        spawnPiece(state, player);
        return false;
    }
}

function checkGameEnd(state) {
    for (y = 0; y < 4; y++) {
        for (x = 0; x < width; x++) {
            if (getAs(state.board, y, x, P1) === TERR) {
                return P1;
            } else if(getAs(state.board, y, x, P2) === TERR) {
                return P2;
            }
        }
    }
    return -1;
}

function forcePieceOnBG(state, piece) {
    let shape = piece.rotations[piece.r];
    for (let y = 0; y < piece.h; y++) {
        for (let x = 0; x < piece.w; x++) {
            if (shape[y][x] === 1 && getAs(state.board, piece.y + y, piece.x + x, piece.player) === TERR) {
                setAs(state.board, piece.y + y, piece.x + x, piece.player, BG);
            }
        }
    }
}

function pieceIntersects(state, piece) {
    let shape = piece.rotations[piece.r];
    for (let y = 0; y < piece.h; y++) {
        for (let x = 0; x < piece.w; x++) {
            if (shape[y][x] === 1 && getAs(state.board, piece.y + y, piece.x + x, piece.player) === TERR) {
                return true;
            }
        }
    }
    return false;
}

function spawnPiece(state, player) {
    let piece = createPiece(player);
    state.players[player].piece = piece;
    state.players[player].gravityTicks = state.gravity;
}

function createPiece(player) {
    let shape = pieces[Math.floor(Math.random() * pieces.length)];
    let w = shape.rotations[0][0].length;
    return {
        y: 0,
        x: 5 - Math.floor(w / 2),
        h: shape.rotations[0].length,
        w: w,
        player: player,
        r: 0,
        rotations: shape.rotations,
        wallkicks: shape.wallkicks
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