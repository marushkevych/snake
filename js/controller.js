var grid = require('game-grid');
var makeSnake = require('./Snake');

var SoundEffectManager = require('sound-effect-manager');
var sound = new SoundEffectManager();
sound.loadFile('jump.wav', 'rocket');
sound.loadFile('boo.mp3', 'boo');


var canvas = document.getElementById("canvas");
var size = 35;
var speed = 80;
var view = new grid.GridView(canvas, {size: size, scale: 12});
var model = new grid.GridModel(size);
var intervalId;

var LEFT = 37;
var UP = 38;
var RIGHT = 39;
var DOWN = 40;
var direction = LEFT;
var snake;
var score = 0;

var playButton = document.getElementById("play");
var pauseButton = document.getElementById("pause");
var newGameButton = document.getElementById("new");
var scoreElement = document.getElementById("score");

// gane coontrol state machine
var pausedState = {
    name: 'pausedState',
    display: function() {
        document.getElementById("gameoverMessage").style.display = "none";
        document.getElementById("pauseMessage").style.display = "inline";
        document.getElementById("playMessage").style.display = "none";
        // diaplya play button and score
        pauseButton.style.display = "none";
        newGameButton.style.display = "inline";
        playButton.style.display = "inline";
    },
    play: function() {
        setState(playingState);
        play();
    },
    pause: function() {
//        debugger;
        this.play();
    },
    newGame: function() {
        clear();
        setUp();
    },
    changeDirection: function(code) {
        // if not opposite
        if (Math.abs(code - direction) != 2) {
            direction = code;
            this.play();
        }
        //do nothing
    }
};
var playingState = {
    name: 'playingState',
    display: function() {
        document.getElementById("pauseMessage").style.display = "none";
        document.getElementById("playMessage").style.display = "inline";
        
        // display score and pause button and new game button
        pauseButton.style.display = "inline";
        newGameButton.style.display = "inline";
        playButton.style.display = "none";
    },
    play: function() {
        //this.pause();
    },
    pause: function() {
        setState(pausedState);
        pause();
    },
    newGame: function() {
        this.pause();
        clear();
        setUp();
    },
    changeDirection: function(code) {
        direction = code;
    }
};
var gameOverState = {
    name: 'gameOverState',
    display: function() {
        // display game over text
        document.getElementById("gameoverMessage").style.display = "inline";
        document.getElementById("playMessage").style.display = "none";
        
        //clear();
        var context = canvas.getContext("2d");
        context.font = "bold 50px sans-serif";
        context.fillStyle = 'white';
        context.fillText("Game  Over   :(", 20, 200);
        context.fillStyle = 'black';
        
        pauseButton.style.display = "none";
        newGameButton.style.display = "inline";
        playButton.style.display = "none";
    },
    play: function() {

    },
    pause: function() {
        // do nothing
    },
    newGame: function() {
        setState(pausedState);
        clear();
        setUp();
    },
    changeDirection: function(code) {
        // do nothing
    }
};

var gameControl;
setState(pausedState);

function setState(state) {
    gameControl = state;
    state.display();
}

// configure view


playButton.addEventListener("click", function(){
    gameControl.play();
}, false);
pauseButton.addEventListener("click", function(){
    gameControl.pause();
}, false);
newGameButton.addEventListener("click", function(e) {
    gameControl.newGame();
    this.blur();
}, false);

window.addEventListener('keydown', keydownEventHandler, false);

function keydownEventHandler(e) {
//    console.log(e.keyCode);
    //arrows
    if (e.keyCode >= 37 && e.keyCode <= 40){
        gameControl.changeDirection(e.keyCode);
        return;
    }
    // space
    if (e.keyCode == 32) {
        gameControl.pause();
        return;
    }
    //esc
    if (e.keyCode == 27) {
        gameControl.newGame();
        return;
    }
    
    // any other key
    gameControl.play();

}

view.paintBorder('black');
setUp();


function clear() {
    var context = canvas.getContext("2d");
    context.clearRect(20, 160, 400, 50)
    snake = null;
    direction = LEFT;
    score = 0;
    scoreElement.innerHTML = "0";
    model.eachCell(function(cell) {
        cell.isSnake = false;
        cell.isFood = false;
        view.clearCell(cell);
    });
}

function pause() {

    clearInterval(intervalId);
}

function setUp() {
    snake = makeSnake(model, view);
    generateFood();
}

// main loop
function play() {
    intervalId = setInterval(tick, speed);

    function tick() {
        var next = getNextCell(snake.getHead());
        if (next == null || next.isSnake) {
            sound.play('boo');
//            console.log("game over!!!!");
            pause();
            setState(gameOverState);
            return;
        }
        if (next.isFood) {
            sound.play('rocket');
            scoreElement.innerHTML = ++score;
            generateFood();
        }

        snake.move(next);
    }
}


function getNextCell(head) {
    switch (direction) {
        case LEFT:
            return model.getNextCellLeft(head.x, head.y);
            break;
        case UP:
            return model.getNextCellUp(head.x, head.y);
            break;
        case RIGHT:
            return model.getNextCellRight(head.x, head.y);
            break;
        case DOWN:
            return model.getNextCellDown(head.x, head.y);
            break;
    }



}

function generateFood() {
    var cell = model.getRandomCell(function(cell){
//        console.log('generating food', cell.isSnake, cell.isFood)
        if(cell.isSnake || cell.isFood) return false;
        return true;
    });
    cell.isFood = true;
    canvas.getContext("2d").fillStyle = 'red';
    view.fillCell(cell);
    canvas.getContext("2d").fillStyle = 'black';
}




    