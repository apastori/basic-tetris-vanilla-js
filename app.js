const height = 20;
const width = 10;
const grid = height * width;
let timerId;

document.addEventListener("DOMContentLoaded", () => {
    tetrisApp();
});

function generateSquares(gridContainer) {
    for (let i = 0; i < grid; i++) {
        const elementGrid = document.createElement("div");
        elementGrid.classList.add("gridElement");
        gridContainer.appendChild(elementGrid);
    }
}

function generateTakenRow(gridContainer) {
    for (let i = 0; i < 10; i++) {
        const elementGrid = document.createElement("div");
        elementGrid.classList.add("taken");
        gridContainer.appendChild(elementGrid);
    }
}

function tetrisApp() {
    console.log("Tetris Start");
    const gridContainer = document.getElementsByClassName("grid")[0];
    console.log(gridContainer);
    let squares = gridContainer.getElementsByTagName("div");
    console.log(squares);
    const scoreDisplay = document.getElementById("score");
    const startButton = document.getElementById("start-button");
    //The Tetrominoes
    const lTetromino = [
        [1, width+1, width*2+1, 2],
        [width, width+1, width+2, width*2+2],
        [1, width+1, width*2+1, width*2],
        [width, width*2, width*2+1, width*2+2]
    ];

    const zTetromino = [
        [0,width,width+1,width*2+1],
        [width+1, width+2,width*2,width*2+1],
        [0,width,width+1,width*2+1],
        [width+1, width+2,width*2,width*2+1]
    ];

    const tTetromino = [
        [1,width,width+1,width+2],
        [1,width+1,width+2,width*2+1],
        [width,width+1,width+2,width*2+1],
        [1,width,width+1,width*2+1]
    ];

    const oTetromino = [
        [0,1,width,width+1],
        [0,1,width,width+1],
        [0,1,width,width+1],
        [0,1,width,width+1]
    ];

    const iTetromino = [
        [1,width+1,width*2+1,width*3+1],
        [width,width+1,width+2,width+3],
        [1,width+1,width*2+1,width*3+1],
        [width,width+1,width+2,width+3]
    ];
    const theTetrominoes = [lTetromino, zTetromino, tTetromino, oTetromino, iTetromino];
    let currentPosition = 4;
    let currentRotation = 0;
    let random = Math.floor(Math.random() * theTetrominoes.length);
    let current = theTetrominoes[random][currentRotation];
    generateSquares(gridContainer);
    console.log(squares);
    generateTakenRow(gridContainer);
    console.log(gridContainer);
    function draw() {
        current.forEach(tetraPosition => {
            squares[currentPosition + tetraPosition].classList.add('tetromino');
        });    
    }
    draw();
    function undraw() {
        current.forEach(tetraPosition => {
            squares[currentPosition + tetraPosition].classList.remove('tetromino');
        });
    }
    // Make the tetromino move Down
    timerId = setInterval(moveDown, 1000);

    //assign keyCodes
    function control(e) {
        if (e.keyCode === 37) {
            moveLeft();
        } else if (e.keyCode === 39) {
            moveRight();
        } else if (e.keyCode === 38) {
            rotate();
        }
    }

    document.addEventListener("keyup", control);

    function moveDown() {
        undraw();
        currentPosition += width;
        draw();
        freeze();
    }
    // Freeze the tetromino at the bottom of grid
    function freeze() {
        if (current.some(indexTet => {
            return squares[currentPosition + indexTet + width].classList.contains("taken")
        })) {
            current.forEach(indexTet => squares[currentPosition + indexTet].classList.add("taken"));
            // start new tetramino falling
            random = Math.floor(Math.random() * theTetrominoes.length);
            console.log("currentRotation", currentRotation);
            console.log(theTetrominoes);
            current = theTetrominoes[random][currentRotation];
            currentPosition = 4;
            draw();
        }
    }

    function moveLeft() {
        undraw();
        const isAtLeftEdge = current.some((index) => {
            return ((currentPosition + index) % width === 0);
        })
        if (!isAtLeftEdge) currentPosition -= 1;
        if (current.some(index => {
            return squares[currentPosition + index].classList.contains("taken");
        })) {
            currentPosition += 1;
        }
        draw();
    }

    function moveRight() {
        undraw();
        const isAtRightEdge = current.some((index) => {
            return ((currentPosition + index) % width === width - 1);
        })
        if (!isAtRightEdge) currentPosition += 1;
        if (current.some(index => {
            return squares[currentPosition + index].classList.contains("taken");
        })) {
            currentPosition -= 1;
        }
        draw();
    }

    // Rotate the tetris piece
    function rotate() {
        undraw();
        currentRotation++;
        if (currentRotation === current.length) currentRotation = 0;
        current = theTetrominoes[random][currentRotation];
        draw();
    }

}