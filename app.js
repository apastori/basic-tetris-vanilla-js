const height = 20;
const width = 10;
const grid = height * width;
let timerId;
let nextRandom = 0;
let score = 0;
let running = false;

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
    generateSquares(gridContainer);
    generateTakenRow(gridContainer);
    generateMiniGrid(miniGridContainer);
    let squares = Array.from(gridContainer.getElementsByTagName("div"));
    console.log(squares);
    const scoreDisplay = document.getElementById("score");
    const startButton = document.getElementById("start-button");
    const paragraphStartStop = document.querySelector("#paragraphStartStop");
    paragraphStartStop.innerHTML = "Game is stopped";
    const colors = [
        'orange',
        'red',
        'purple',
        'green',
        'blue'
    ];    
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
    console.log(gridContainer);
    function draw() {
        current.forEach(tetraPosition => {
            squares[currentPosition + tetraPosition].classList.add('tetromino');
            squares[currentPosition + tetraPosition].style.backgroundColor = colors[random]
        });    
    }
    function undraw() {
        current.forEach(tetraPosition => {
            squares[currentPosition + tetraPosition].classList.remove('tetromino');
            squares[currentPosition + tetraPosition].style.backgroundColor = ''
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
        if (!running && !timerId) return;
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
            current = theTetrominoes[random][currentRotation];
            currentPosition = 4;
            draw();
            displayNext();
            addScore();
            gameOver();
        }
    }

    function moveLeft() {
        if (!running && !timerId) return;
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
        if (!running && !timerId) return;
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

    function isAtRight() {
        return current.some(indexTet => {
            return ((currentPosition + indexTet + 1) % width === 0);
        })
    }
    
    function isAtLeft() {
        return current.some(indexTet => {
            return ((currentPosition + indexTet) % width === 0)
        }) 
    }

    function checkRotatedPosition(P) {
        P = P || currentPosition;
        if ((P+1) % width < 4) {     
          if (isAtRight()) {
                currentPosition += 1 
                checkRotatedPosition(P) 
            }
        } else if (P % width > 5) {
          if (isAtLeft()) {
            currentPosition -= 1
            checkRotatedPosition(P)
          }
        }
    }
    
    // Rotate the tetris piece
    function rotate() {
        if (!running && !timerId) return;
        undraw();
        currentRotation++;
        if (currentRotation === current.length) currentRotation = 0;
        current = theTetrominoes[random][currentRotation];
        checkRotatedPosition();
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
            nextSquare.style.backgroundColor = '';
        });
        nextTetrominoes[nextRandom].forEach(tetroIndex => {
            nextSquares[nextIndex + tetroIndex].classList.add("tetromino");
            nextSquares[nextIndex + tetroIndex].style.backgroundColor = colors[nextRandom];
        })
    }

    //Add functionality to start
    startButton.addEventListener("click", () => {
        if (running && timerId) {
            clearInterval(timerId);
            timerId = null;
            running = false;
            paragraphStartStop.innerHTML = "Game is stopped";
        } else {
            draw();
            timerId = setInterval(moveDown, 1000);
            running = true;
            paragraphStartStop.innerHTML = "Game is Running";
            if (Array.from(miniGridContainer.getElementsByClassName("tetromino")).length === 0) {
                nextRandom = Math.floor(Math.random() * theTetrominoes.length);
                displayNext();
            }
        }
    });

    // Add scoreboard counting
    function addScore() {
        console.log(squares);
        for (let i = 0; i < 199; i += width) {
            const row = [
                i, i+1, i+2, i+3, i+4, i+5, i+6, i+7, i+8, i+9
            ];
            if (row.every(indexSquare => {
                return squares[indexSquare].classList.contains("taken");
            })) {
                score += 10;
                scoreDisplay.innerHTML = score;
                row.forEach(indexRow => {
                    squares[indexRow].classList.remove("taken");
                    squares[indexRow].classList.remove("tetromino");
                    squares[indexRow].style.backgroundColor = '';
                });
                const squaresRemoved = squares.splice(i, width);
                console.log(squaresRemoved);
                squares = squaresRemoved.concat(squares);
                console.log(squares);
                squares.forEach((cell) => {
                    gridContainer.appendChild(cell);
                });
            }
        }
    }

    function gameOver() {
        if (current.some(indexTetra => {
            return squares[currentPosition + indexTetra].classList.contains("taken")    
        })) {
            scoreDisplay.innerHTML = "End";
            clearInterval(timerId);
        }
    }

}