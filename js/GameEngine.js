var grid = require('game-grid');
var SoundEffectManager = require('sound-effect-manager');
var makeSnake = require('./Snake');

var sound = new SoundEffectManager();
sound.loadFile('jump.wav', 'rocket');
sound.loadFile('boo.mp3', 'boo');

var intervalId;
var snake;

var LEFT = 37;
var UP = 38;
var RIGHT = 39;
var DOWN = 40;
exports.direction = LEFT;

var gameOverCallback;
var foodEatenEventCallback;
var canvas;

var model;
var view;

exports.init = function(canvasElement, size){
    canvas = canvasElement;
    model = new grid.GridModel(size);
    view = new grid.GridView(canvas, {size: size, scale: 12});
    this.setUp();
    view.paintBorder('black');
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
    var self = this;
    debugger;
    function tick() {
        var next = getNextCell(snake.getHead(), self.direction);
        if (next == null || next.isSnake) {
            sound.play('boo');
            console.log("game over!!!!");
            self.pause();
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

exports.pause = function() {
    clearInterval(intervalId);
};

exports.clear = function() {
    var context = canvas.getContext("2d");
    context.clearRect(20, 160, 400, 50);
    snake = null;
    exports.direction = LEFT;
    model.eachCell(function(cell) {
        cell.isSnake = false;
        cell.isFood = false;
        view.clearCell(cell);
    });
}

function getNextCell(head, direction) {
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
        default:
            throw new Error("Diretion is not set")
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


