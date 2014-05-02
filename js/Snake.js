

module.exports = function(model, view){
    var length = 10;
    var snake = [];
    init();
    
    function init(){
        // init snake
        var x = model.size/2;
        var y = model.size/2;
        for(var i = 0; i < length; i++){
            snake.push(model.getCell(x+i,y));
        }

        snake.forEach(function(cell) {
            view.fillCell(cell);
            cell.isSnake = true;
        });
    }
    
    function move(newHead){

        newHead.isSnake = true;
        view.fillCell(newHead);
        snake.unshift(newHead);
        // if not food - chop the tail
        if(!!newHead.isFood == false){
            var tail = snake.pop();
            view.clearCell(tail);
            tail.isSnake = false;
        }
        newHead.isFood = false;
        return true;
    }
    
    function getHead(){
        return snake[0];
    }
    
    return {
        getHead: getHead,
        move: move
    };
};

