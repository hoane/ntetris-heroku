let width = 10;
let height = 30;

let P1 = 0;
let P2 = 1;

let BG = 2;
let TERR = 3;

let S = 0;
let R = 1;
let F = 2;
let L = 1;

function k(x, y) { return { x: x, y: y } }

let wallkicks = {
    S: {
        R: [k(0, 0), k(-1, 0), k(-1, 1), k(0, -2), k(-1, -2)],
        L: [k(0, 0), k(1, 0), k(1, 1), k(0, -2), k(1, -2)]
    },
    R: {
        F: [k(0, 0), k(1, 0), k(1, -1), k(0, 2), k(1, 2)],
        S: [k(0, 0), k(1, 0), k(1, -1), k(0, 2), k(1, 2)]
    },
    F: {
        L: [k(0, 0), k(1, 0), k(1, 1), k(0, -2), k(1, -2)],
        R: [k(0, 0), k(-1, 0), k(-1, 1), k(0, -2), k(-1, -2)]
    },
    L: {
        S: [k(0, 0), k(-1, 0), k(-1, -1), k(0, 2), k(-1, 2)],
        F: [k(0, 0), k(-1, 0), k(-1, -1), k(0, 2), k(-1, 2)]
    }
};

let iWallkicks = {
    S: {
        R: [k(0, 0), k(-2, 0), k(1, 0), k(-2, -1), k(1, 2)],
        L: [k(0, 0), k(-1, 0), k(2, 0), k(-1, 2), k(2, -1)]
    },
    R: {
        F: [k(0, 0), k(-1, 0), k(2, 0), k(-1, 2), k(2, -1)],
        S: [k(0, 0), k(2, 0), k(-1, 0), k(2, 1), k(-1, -2)]
    },
    F: {
        L: [k(0, 0), k(2, 0), k(-1, 0), k(2, 1), k(-1, -2)],
        R: [k(0, 0), k(1, 0), k(-2, 0), k(1, -2), k(-2, 1)]
    },
    L: {
        S: [k(0, 0), k(1, 0), k(-2, 0), k(1, -2), k(-2, 1)],
        F: [k(0, 0), k(-2, 0), k(1, 0), k(-2, -1), k(1, 2)]
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
        kicks: iWallkicks
    },
    // J
    {
        rotations: [
            [[1, 0, 0], [1, 1, 1], [0, 0, 0]],
            [[0, 1, 1], [0, 1, 0], [0, 1, 0]],
            [[0, 0, 0], [1, 1, 1], [0, 0, 1]],
            [[0, 1, 0], [0, 1, 0], [1, 1, 0]]
        ],
        kicks: wallkicks
    },
    // L
    {
        rotations: [
            [[0, 0, 1], [1, 1, 1], [0, 0, 0]],
            [[0, 1, 0], [0, 1, 0], [0, 1, 1]],
            [[0, 0, 0], [1, 1, 1], [1, 0, 0]],
            [[1, 1, 0], [0, 1, 0], [0, 1, 0]]
        ],
        kicks: wallkicks
    },
    // O
    {
        rotations: [
            [[1, 1], [1, 1]]
        ],
        kicks: null
    },
    // S
    {
        rotations: [
            [[0, 1, 1], [1, 1, 0], [0, 0, 0]],
            [[0, 1, 0], [0, 1, 1], [0, 0, 1]],
            [[0, 0, 0], [0, 1, 1], [1, 1, 0]],
            [[1, 0, 0], [1, 1, 0], [0, 1, 0]]
        ],
        kicks: wallkicks
    },
    // T
    {
        rotations: [
            [[0, 1, 0], [1, 1, 1], [0, 0, 0]],
            [[0, 1, 0], [0, 1, 1], [0, 1, 0]],
            [[0, 0, 0], [1, 1, 1], [0, 1, 0]],
            [[0, 1, 0], [1, 1, 0], [0, 1, 0]]
        ],
        kicks: wallkicks
    },
    // Z
    {
        rotations: [
            [[1, 1, 0], [0, 1, 1], [0, 0, 0]],
            [[0, 0, 1], [0, 1, 1], [0, 1, 0]],
            [[0, 0, 0], [1, 1, 0], [0, 1, 1]],
            [[0, 1, 0], [1, 1, 0], [1, 0, 0]]
        ],
        kicks: wallkicks
    }
];

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

    rowsToClear.forEach(r, i => {
        let row = r + i;
        for (let y = row; y > 0; y--) {
            for (let x = 0; x < width; x++) {
                let upVal = getAs(state.board, y - 1, x, player);
                setAs(state.board, y, x, player, upVal);
            }
        }
    });

    state.players[player].piece = null;
    spawnPiece(state, player);
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
}

function spinPiece(piece, cw) {

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
        rotations: shape.rotations
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