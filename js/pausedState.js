exports.name = 'pausedState';

exports.display = function() {
    document.getElementById("gameoverMessage").style.display = "none";
    document.getElementById("pauseMessage").style.display = "inline";
    document.getElementById("playMessage").style.display = "none";
    // diaplya play button and score
    pauseButton.style.display = "none";
    newGameButton.style.display = "inline";
    playButton.style.display = "inline";
};

exports.play = function() {
    setState(playingState);
    play();
};

exports.pause = function() {
//        debugger;
    this.play();
};

exports.newGame = function() {
    clear();
    setUp();
};

exports.changeDirection = function(code) {
    // if not opposite
    if (Math.abs(code - direction) != 2) {
        direction = code;
        this.play();
    }
    //do nothing
};

