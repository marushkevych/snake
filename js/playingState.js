exports.name = 'playingState';
exports.display = function() {
    document.getElementById("pauseMessage").style.display = "none";
    document.getElementById("playMessage").style.display = "inline";

    // display score and pause button and new game button
    pauseButton.style.display = "inline";
    newGameButton.style.display = "inline";
    playButton.style.display = "none";
};

exports.play = function() {
    //this.pause();
};

exports.pause = function() {
    setState(pausedState);
    pause();
};

exports.newGame = function() {
    this.pause();
    clear();
    setUp();
};

exports.changeDirection = function(code) {
    direction = code;
};

