//for difficulty buttons
function setDifficulty(num) {
    document.getElementById("myCanvas").hidden = false;
    document.getElementById("init").hidden = true;
    if (document.getElementById("turn").checked == true) {
        goFirst = 2
    }
    MAX_BRANCHES = num;
    setTimeout(() => {
        game();
    }, 100)
}

let MAX_BRANCHES = 7;
let goFirst = 1;

//the game
function game() {
    let canvas = document.getElementById("myCanvas");
    let ctx = canvas.getContext("2d");

    let board = [
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0]
    ]
    let selectColumn = -1;
    let boardEval = 0;
    let winner = 0;

    let turn = goFirst;

    function constrain(min, max, val) {
        return val < min ? min : (val > max ? max : val)
    }

    //click detection
    window.addEventListener('click', (e) => {
        //determine what hitbox the client was clicking in
        selectColumn = constrain(0, 7, Math.floor((e.clientX - 50) /
            120));
        if (winner != 0) {
            board = [
                [0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0]
            ]
            boardEval = 0;
            winner = 0;
            turn = goFirst;
            refreshDisplay();
        } else {
            move(selectColumn)
        }
    })

    function move(column) {
        if (board[0][column] == 0 && boardEval != Infinity && boardEval != -Infinity && turn == 1) {
            //there is empty space

            //find the highest slot possible
            for (y in board) {
                if (board[y][column] != 0) {
                    board[y - 1][column] = 1
                    turn = 2
                    break;
                }
            }
            if (board[5][column] == 0) { //the lowest slot is a 0, you can put a token here
                board[5][column] = 1
                turn = 2
            }
        }

        boardEval = evalBoard(board, 1)
        refreshDisplay('computing...');
        setTimeout(() => {
                if (turn == 2 && (boardEval != Infinity && boardEval != -Infinity)) {
                    //trigger AI for green
                    board = minimax(board, 0, -Infinity, Infinity, true)[1]
                    turn = 1
                }
                boardEval = evalBoard(board, 1)

                if (boardEval == Infinity) winner = 1;
                if (boardEval == -Infinity) winner = 2;
                refreshDisplay('player turn');
            }, 1) //add delay so the board can update before computing
    }

    function refreshDisplay(status) {
        ctx.fillStyle = '#AAAAAA'
        ctx.fillRect(0, 0, 950, 830);
        //circles
        for (x in board) {
            for (y in board[x]) {
                ctx.fillStyle = board[x][y] == 0 ? '#FFFFFF' : (board[x][y] == 1 ? 'red' : 'green')
                ctx.beginPath();
                ctx.arc(110 + y * 120, 110 + x * 120, 50, 0, 2 * Math.PI);
                ctx.fill();
            }
        }
        //top bar
        ctx.fillStyle = '#666666'
        ctx.fillRect(0, 0, 950, 30)

        ctx.font = '15px Georgia'

        //name
        ctx.textAlign = "center";
        ctx.fillStyle = "#222222"
        ctx.fillRect(0, 0, 100, 30)
        ctx.fillStyle = "white";
        ctx.fillText("Connect 4", 50, 20)

        //difficulty
        ctx.textAlign = "center";
        ctx.fillStyle = "#888888"
        ctx.fillRect(100, 0, 100, 30)
        ctx.fillStyle = "white";
        ctx.fillText(`Difficulty: ${MAX_BRANCHES-4}/3`, 150, 20)
        ctx.fillStyle = MAX_BRANCHES == 7 ? '#FF0000' : (MAX_BRANCHES == 6 ? `#FFFF00` : `#2FFF2F`)
        ctx.fillRect(200, 0, 30, 30)

        //AI eval
        //difficulty
        ctx.textAlign = "center";
        ctx.fillStyle = "#888888"
        ctx.fillRect(230, 0, 140, 30)
        ctx.fillStyle = "white";
        ctx.fillText(`Evaluation: ${winner != 0 ? boardEval.toString().replace('Infinity','∞') : boardEval}`, 300, 20)
        ctx.fillStyle = boardEval < 0 ? '#FF0000' : `#2FFF2F`
        ctx.fillRect(370, 0, 30, 30)
            //status text
        ctx.textAlign = "center";
        ctx.fillStyle = "#FFFFFF";
        ctx.font = '20px Georgia'
        ctx.fillText(status, 450, 800)




        //winner
        ctx.globalAlpha = 0.9
        if (winner != 0) {
            //winner result display box

            ctx.fillStyle = '#AAAAAA'
            ctx.fillRect(225, 200, 500, 300)
            ctx.strokeRect(225, 200, 500, 300)
                //text
            ctx.textAlign = "center";
            ctx.fillStyle = "#FFFFFF";
            ctx.font = '90px Georgia'
            ctx.fillText('Game Over', 475, 290)
            ctx.font = '40px Georgia'
            ctx.fillText('Winner:', 475, 330)
                //winner text
            ctx.fillStyle = winner == 1 ? 'red' : 'green'
            ctx.fillText(winner == 1 ? 'Player' : 'AI', 475, 370)
            ctx.fillStyle = 'white'

            ctx.font = '20px Georgia'
            ctx.fillText(`Difficulty: ${MAX_BRANCHES-4}/3\n${goFirst==1?'player':'ai'} went first`, 475, 430)
            ctx.font = '10px Georgia'
            ctx.fillText('Click to retry', 475, 390)
        } else if (isTie(board)) {
            //winner result display box
            ctx.fillStyle = '#AAAAAA'
            ctx.fillRect(225, 200, 500, 300)
            ctx.strokeRect(225, 200, 500, 300)
                //text
            ctx.textAlign = "center";
            ctx.fillStyle = "#FFFFFF";
            ctx.font = '90px Georgia'
            ctx.fillText('Tie', 475, 290)
            ctx.font = '40px Georgia'
            ctx.fillText('You tied!', 475, 330)

            ctx.font = '20px Georgia'
            ctx.fillText(`Difficulty: ${MAX_BRANCHES-3}/3\n${goFirst==1?'player':'ai'} went first`, 475, 430)
            ctx.font = '10px Georgia'
            ctx.fillText('Click to retry', 475, 350)
        }
        ctx.globalAlpha = 1
    }

    function isTie(board) {
        for (i in board[0]) {
            if (board[0][i] == 0) {
                return false;
            }
        }
        if (winner == 0) {
            return true;
        }
    }

    //save computing time by pregenerating
    const DIAGONAL_LINES = [
        [
            [0, 3],
            [1, 2],
            [2, 1],
            [3, 0]
        ],
        [
            [0, 4],
            [1, 3],
            [2, 2],
            [3, 1],
            [4, 0]
        ],
        [
            [0, 5],
            [1, 4],
            [2, 3],
            [3, 2],
            [4, 1],
            [5, 0]
        ],
        [
            [0, 6],
            [1, 5],
            [2, 4],
            [3, 3],
            [4, 2],
            [5, 1]
        ],
        [
            [0, 6],
            [1, 5],
            [2, 4],
            [3, 3],
            [4, 2],
            [5, 1]
        ],
        [
            [1, 6],
            [2, 5],
            [3, 4],
            [4, 3],
            [5, 2]
        ],
        [
            [2, 6],
            [3, 5],
            [4, 4],
            [5, 3]
        ],
        [
            [0, 3],
            [1, 4],
            [2, 5],
            [3, 6]
        ],
        [
            [0, 2],
            [1, 3],
            [2, 4],
            [3, 5],
            [4, 6]
        ],
        [
            [0, 1],
            [1, 2],
            [2, 3],
            [3, 4],
            [4, 5],
            [5, 6]
        ],
        [
            [0, 0],
            [1, 1],
            [2, 2],
            [3, 3],
            [4, 4],
            [5, 5]
        ],
        [
            [0, 0],
            [1, 1],
            [2, 2],
            [3, 3],
            [4, 4],
            [5, 5]
        ],
        [
            [1, 0],
            [2, 1],
            [3, 2],
            [4, 3],
            [5, 4]
        ],
        [
            [2, 0],
            [3, 1],
            [4, 2],
            [5, 3]
        ]
    ]

    function scoreSequence(seq, player) {
        if (seq.length < 4) {
            return 0
        }
        let s = 0; //score
        let r = 0; //actual run
        let p = 0; //potential run
        let c = 0; //current
        let ch = 0; //cache
        let rr = 0;
        for (let i = 0; i < seq.length; i++) {
            const v = seq[i]
            if (v != 0) {
                if (c != v) {
                    if (p + r + ch >= 4 && r > 1 && c != 0) {
                        s += r ** 4 * (c == player ? 1 : -1)
                    }
                    ch = p
                    r = 0;
                    rr = 0;

                }
                c = v
                p = 0;


            } else {
                p++
                rr = 0;
            }
            if (c == v) {
                r++;
                rr++;
            }

            if (rr >= 4 && c != 0) {
                return Infinity * (c == player ? 1 : -1)
            }
        }
        if (p + r + ch >= 4 && r > 1 && c != 0) {
            s += r ** 4 * (c == player ? 1 : -1)
        }
        return s
    }

    function evalBoard(board, player) {
        let total = 0;
        //check horizontal
        for (let y = 0; y < 6; y++) {
            total += scoreSequence(board[y], player)
        }
        //check vertical
        for (let x = 0; x < 7; x++) {
            let seq = [];
            for (let y = 0; y < 6; y++) {
                seq.push(board[y][x])
            }
            total += scoreSequence(seq, player)
        }
        //check diagnals 
        for (i in DIAGONAL_LINES) {
            let sequence = []
            for (seq in DIAGONAL_LINES[i]) {
                sequence.push(board[DIAGONAL_LINES[i][seq][0]][DIAGONAL_LINES[i][seq][1]])
            }
            total += scoreSequence(sequence, player)
        }
        //screw this
        if (isNaN(total)) {
            return -Infinity
        }

        return total
    }

    function getChildren(board, player) {
        //check the top row. We can determine if a move is possible from this
        let results = []
        for (i in board[0]) {
            if (board[0][i] == 0) {
                //there is empty space

                //find the highest slot possible
                for (y in board) {
                    if (board[y][i] != 0) {
                        let copy = JSON.parse(JSON.stringify(board)) //WHY DO I HAVE TO DO THIS!?!??!
                        copy[y - 1][i] = player
                        results.push(copy)
                        break;
                    }
                }
                if (board[5][i] == 0) { //the lowest slot is a 0, you can put a token here
                    let copy = JSON.parse(JSON.stringify(board)) //WHY DO I HAVE TO DO THIS!?!??!
                    copy[5][i] = player
                    results.push(copy)
                }
            }
        }
        return results;
    }


    //minimax
    function minimax(board, layer, alpha, beta, maxPlayer) {
        let currenteval = evalBoard(board, 2)
        if (layer == MAX_BRANCHES || (currenteval == Infinity || currenteval == -Infinity)) {
            return [currenteval, null];
        }
        if (maxPlayer) {
            const children = getChildren(board, 2);
            const results = [];
            let max = -Infinity
            for (let i = 0; i < children.length; i++) {
                const childeval = minimax(children[i], layer + 1, alpha, beta, !maxPlayer)[0]
                alpha = Math.max(alpha, childeval);
                max = Math.max(max, childeval)
                results.push(childeval)
                if (beta <= alpha) {
                    break;
                }
            }
            return [max, children[results.indexOf(max)]]

        } else {
            const children = getChildren(board, 1);
            const results = [];
            let min = Infinity
            for (let i = 0; i < children.length; i++) {
                const childeval = minimax(children[i], layer + 1, alpha, beta, !maxPlayer)[0]
                alpha = Math.min(alpha, childeval);
                min = Math.min(min, childeval)
                results.push(childeval)
                if (beta <= alpha) {
                    break;
                }
            }
            return [min, children[results.indexOf(min)]]
        }
    }


    refreshDisplay('Click to start');
}