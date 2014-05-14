module.exports = SwipeListener;

function SwipeListener(gameContainerElement) {
    this.gameContainer = gameContainerElement;
    this.events = {};
    
    if (window.navigator.msPointerEnabled) {
        //Internet Explorer 10 style
        this.eventTouchstart = "MSPointerDown";
        this.eventTouchmove = "MSPointerMove";
        this.eventTouchend = "MSPointerUp";
    } else {
        this.eventTouchstart = "touchstart";
        this.eventTouchmove = "touchmove";
        this.eventTouchend = "touchend";
    }

    this.listen();
}

SwipeListener.UP = 'up';
SwipeListener.RIGHT = 'right';
SwipeListener.DOWN = 'down';
SwipeListener.LEFT = 'left';

SwipeListener.prototype.on = function(event, callback) {
    if (!this.events[event]) {
        this.events[event] = [];
    }
    this.events[event].push(callback);
};

SwipeListener.prototype.emit = function(event, data) {
    var callbacks = this.events[event];
    if (callbacks) {
        callbacks.forEach(function(callback) {
            callback(data);
        });
    }
};

SwipeListener.prototype.listen = function() {
    var self = this;

    // Respond to swipe events
    var touchStartClientX, touchStartClientY;

    this.gameContainer.addEventListener(this.eventTouchstart, function(event) {
        if ((!window.navigator.msPointerEnabled && event.touches.length > 1) ||
                event.targetTouches > 1) {
            return; // Ignore if touching with more than 1 finger
        }

        if (window.navigator.msPointerEnabled) {
            touchStartClientX = event.pageX;
            touchStartClientY = event.pageY;
        } else {
            touchStartClientX = event.touches[0].clientX;
            touchStartClientY = event.touches[0].clientY;
        }

        event.preventDefault();
    });

    this.gameContainer.addEventListener(this.eventTouchmove, function(event) {
        event.preventDefault();
    });

    this.gameContainer.addEventListener(this.eventTouchend, function(event) {
        if ((!window.navigator.msPointerEnabled && event.touches.length > 0) ||
                event.targetTouches > 0) {
            return; // Ignore if still touching with one or more fingers
        }

        var touchEndClientX, touchEndClientY;

        if (window.navigator.msPointerEnabled) {
            touchEndClientX = event.pageX;
            touchEndClientY = event.pageY;
        } else {
            touchEndClientX = event.changedTouches[0].clientX;
            touchEndClientY = event.changedTouches[0].clientY;
        }

        var dx = touchEndClientX - touchStartClientX;
        var absDx = Math.abs(dx);

        var dy = touchEndClientY - touchStartClientY;
        var absDy = Math.abs(dy);

        if (Math.max(absDx, absDy) > 10) {
            // (right : left) : (down : up)
            self.emit(absDx > absDy ? (dx > 0 ? SwipeListener.RIGHT : SwipeListener.LEFT) : (dy > 0 ? SwipeListener.DOWN : SwipeListener.UP));
        }
    });
};

