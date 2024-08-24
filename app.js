const height = 20;
const width = 10;
const grid = height * width;
let timerId;
let nextRandom = 0;

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

function generateMiniGrid(gridContainer) {
    for (let i = 0; i < 16; i++) {
        const elementGrid = document.createElement("div");
        elementGrid.classList.add("minigridElement");
        gridContainer.appendChild(elementGrid);
    }
}

function tetrisApp() {
    console.log("Tetris Start");
    const gridContainer = document.getElementsByClassName("grid")[0];
    const miniGridContainer = document.getElementsByClassName("minigrid")[0];
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
    generateMiniGrid(miniGridContainer);
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
    //timerId = setInterval(moveDown, 1000);

    //assign keyCodes
    function control(e) {
        if (e.keyCode === 37) {
            moveLeft();
        } else if (e.keyCode === 39) {
            moveRight();
        } else if (e.keyCode === 38) {
            rotate();
        } else if (e.keyCode === 40) {
            moveDown();
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
            random = nextRandom;
            nextRandom = Math.floor(Math.random() * theTetrominoes.length);
            console.log("currentRotation", currentRotation);
            console.log(theTetrominoes);
            current = theTetrominoes[random][currentRotation];
            currentPosition = 4;
            draw();
            displayNext();
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

    //Show next tetris piece
    const nextSquares = document.getElementsByClassName("minigrid")[0].getElementsByTagName("div");
    const nextWidth = 4;
    let nextIndex = 0;

    //Tetrominos Original Position for Next Display
    const nextTetrominoes = [
        [1, nextWidth+1, nextWidth*2+1, 2], //lTetromino
        [0, nextWidth, nextWidth+1, nextWidth*2+1], //zTetromino
        [1, nextWidth, nextWidth+1, nextWidth+2], //tTetromino
        [0, 1, nextWidth, nextWidth+1], //oTetromino
        [1, nextWidth+1, nextWidth*2+1, nextWidth*3+1] //iTetromino
    ]

    function displayNext() {
        console.log(nextSquares);
        Array.from(nextSquares).forEach(nextSquare => {
            nextSquare.classList.remove('tetromino');
        });
        nextTetrominoes[nextRandom].forEach(tetroIndex => {
            nextSquares[nextIndex + tetroIndex].classList.add("tetromino");
        })
    }

    //Add functionality to start
    startButton.addEventListener("click", () => {
        if (timerId) {
            clearInterval(timerId);
            timerId = null;
        } else {
            draw();
            timerId = setInterval(moveDown, 1000);
            nextRandom = Math.floor(Math.random() * theTetrominoes.length);
            displayNext();
        }
    });

}