var grid = require('game-grid');
var makeSnake = require('./Snake');

var canvas = document.getElementById("canvas");
var size = 35;
var view = new grid.GridView(canvas, {size: size, scale: 12});
var model = new grid.GridModel(size);


var score = 0;

var playButton = document.getElementById("play");
var pauseButton = document.getElementById("pause");
var newGameButton = document.getElementById("new");
var scoreElement = document.getElementById("score");

// init game engine
var gameEngine = require('./GameEngine');
gameEngine.init(canvas);
gameEngine.setFoodEatenEventListener(function(){
    scoreElement.innerHTML = ++score;
});
gameEngine.setGameOverListener(function(){
    setState(gameOverState);
});


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

function clear(){
    gameEngine.clear();
    score = 0;
    scoreElement.innerHTML = "0";
}