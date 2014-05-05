var SoundEffectManager = require('sound-effect-manager');
var sound = new SoundEffectManager();
sound.loadFile('jump.wav', 'rocket');
sound.loadFile('boo.mp3', 'boo');

var intervalId;
var snake;
var direction = LEFT;

var LEFT = 37;
var UP = 38;
var RIGHT = 39;
var DOWN = 40;

var gameOverCallback;
var foodEatenEventCallback;
var canvas;

exports.init = function(canvasElement){
    canvas = canvasElement;
};

exports.setGameOverListener = function(f){
    gameOverCallback = f;
};

exports.setFoodEatenEventListener = function(f){
    foodEatenEventCallback = f;
};

exports.setUp = function() {
    snake = makeSnake(model, view);
    generateFood();
};


// main loop
exports.play = function() {
    intervalId = setInterval(tick, 80);

    function tick() {
        var next = getNextCell(snake.getHead());
        if (next == null || next.isSnake) {
            sound.play('boo');
//            console.log("game over!!!!");
            pause();
            gameOverCallback();
            return;
        }
        if (next.isFood) {
            sound.play('rocket');
            generateFood();
            foodEatenEventCallback();
        }

        snake.move(next);
    }
};

function pause() {
    clearInterval(intervalId);
}

function clear() {
    var context = canvas.getContext("2d");
    context.clearRect(20, 160, 400, 50)
    snake = null;
    direction = LEFT;
    model.eachCell(function(cell) {
        cell.isSnake = false;
        cell.isFood = false;
        view.clearCell(cell);
    });
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
