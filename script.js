const USING = 0, FIXED = 1, EMPTY = 2;
const colors = ['red', 'black', '#f0f0f0']; 
const numRows = 20; 
const numCols = 10; 
let board = [];
for(let i=0; i<numRows; i++)board.push(Array(numCols).fill(2))
const minoes = [
    // I
    [
        [1, 1, 1, 1],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ],
    // O
    [
        [1, 1],
        [1, 1]
    ],
    // T
    [
        [1, 1, 1],
        [0, 1, 0],
        [0, 0, 0]
    ],
    // S
    [
        [0, 1, 1],
        [1, 1, 0],
        [0, 0, 0]
    ],
    // Z
    [
        [1, 1, 0],
        [0, 1, 1],
        [0, 0, 0]
    ],
    // J
    [
        [1, 0, 0],
        [1, 1, 1],
        [0, 0, 0]
    ],
    // L
    [
        [0, 0, 1],
        [1, 1, 1],
        [0, 0, 0]
    ]
    ];
let X, Y, piece, isFixed;

function drawToArray(){
    if(isFixed)return;
    for(let i=0;i<numRows;i++){
        for(let j=0;j<numCols;j++){
            if(board[i][j] === USING)
                board[i][j] = EMPTY;
        }
    }
    for(let i=0;i<piece.length;i++){
        for(let j=0;j<piece[0].length;j++){
            if(piece[i][j])
                board[Y+i][X+j] = USING;
        }
    }
}

function drawToScreen(cellArray){
    for(let i=0;i<numRows;i++){
        for(let j=0;j<numCols;j++){
            cellArray[i][j].style.backgroundColor = colors[board[i][j]];
        }
    }
}

function popMino(){
    const length = minoes.length;
    let idx = Math.floor(Math.random()*length);
    return minoes[idx];
}

function isGameOver(){
    let flag = false;
    for(let i = 0; i < 2; i++){
        for(let j = 0; j < numCols; j++){
            if(board[i][j] === FIXED)
                flag = true;
        }
    }
    return flag;    
}

function rotate(matrix) {
    const n = matrix.length - 1;
    const result = matrix.map((row, i) =>
        row.map((val, j) => matrix[n - j][i])
    );
    return result;
}

function isValid(x, y, r=0){
    if(r){
        const rotated = rotate(piece);
        for(let i=0;i<rotated.length;i++){
            for(let j=0;j<rotated[0].length;j++){
                if(rotated[i][j]){
                    if(board[Y+i][X+j] === FIXED || numRows <= Y+i || numCols <= X+j)
                        return false;
                }
                    
            }
        }
        return true;
    }
    if(x != 0){
        movedX = X + x;
        if(movedX < 0 || numCols - piece.length < movedX)
            return false;
            for(let i=0;i<piece.length;i++){
                for(let j=0;j<piece[0].length;j++){
                    if(piece[i][j]){
                        if(board[Y+i][movedX+j] === FIXED)
                            return false;
                    }
                }
            }
        return true;
    }
    if(y != 0){
        movedY = Y + y;
        if(numRows <= movedY)
            return false;
        for(let i=0;i<piece.length;i++){
            for(let j=0;j<piece[0].length;j++){
                if(piece[i][j]){
                    if(numRows <= movedY+i)
                        return false;
                    if(board[movedY+i][X+j] === FIXED)
                        return false;
                }
            }
        }
    return true;
    }
}

function fix(){
    for(let i = 0; i < numRows; i++){
        for(let j = 0; j < numCols; j++){
            if(board[i][j] === USING)
                board[i][j] = FIXED;
        }
    }
}

function clearLines(){
    let tar = []
    for(let i=numRows-1;0<=i;i--){
        let num = 0;
        for(let j=0;j<numCols;j++){
            if(board[i][j] == FIXED)
                num++;
        }
        if(num == numCols)
            tar.push(i);
    }
    for(let i=0;i<tar.length;i++){
        for(let j=0;j<numCols;j++){
            board[tar[i]][j] = EMPTY;
        }
    }
    while(tar.length > 0){
        num = tar.pop();
        for(let i=num-1;0<=i;i--){
            for(let j=0;j<numCols;j++){
                board[i+1][j] = board[i][j]
            }
        }
    }
}

const game = (cellArray, timerId) => {
    if(isGameOver()){
        clearInterval(timerId);
    }
    if(isFixed){
        piece = popMino();
        X = 3;
        Y = 0;
        isFixed = false;
    }
    if(isValid(0, 1)){
        Y++;
    }else{
        fix();
        isFixed = true;
    }
    clearLines();
    drawToArray();
    drawToScreen(cellArray);
}

function startGame(cellArray){
    const interval = 1000;
    const timerId = setInterval(() => { game(cellArray, timerId); }, interval);
}

function initGame(board_html){
    const cellArray = [];
    for (let i = 0; i < numRows; i++) {
        const row = [];
        for (let j = 0; j < numCols; j++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            board_html.appendChild(cell);
            row.push(cell);
        }
        cellArray.push(row);
    }
    document.onkeydown = function(e){
        if(isFixed)return;
        switch(e.code){
            case 'ArrowLeft': // 左
                if( isValid(-1, 0)) X--;
                break;
            case 'ArrowRight': // 右
                if( isValid(1, 0)) X++;
                break;
            case 'ArrowDown': // 下
                if( isValid(0, 1) ) Y++;
                break;
            case 'ArrowUp': // 上
                if( isValid(0, 0, 1)) piece = rotate(piece);
                break;
        }
        drawToArray();
        drawToScreen(cellArray);
    }
    piece = popMino();
    X = 3;
    Y = 0;
    isFixed = false;
    drawToArray();
    return cellArray;
}

const board_html = document.getElementById('board');
window.onload = function(){
    const cellArray = initGame(board_html);
    startGame(cellArray);
}