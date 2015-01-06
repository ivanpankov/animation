/**
 * Created by Ivan on 21.12.2014 г..
 */

(function () {
    'use strict';

    /*
     * LinkedList
     */
    function link(a, b) {
        a._next = b;
        b._prev = a;
    }

    function LinkedList() {
        this.head = {name: 'head'};
        this.tail = {name: 'tail'};
        this.count = 0;
        link(this.head, this.tail);
    }

    LinkedList.prototype.add = function (node) {
        if (node._prev && node._next) {
            this.remove(node);
        }
        link(this.tail._prev, node);
        link(node, this.tail);
        this.count += 1;
    };
    LinkedList.prototype.remove = function (node) {
        if (!node._prev || !node._next) return;
        link(node._prev, node._next);
        node._prev = null;
        node._next = null;
        this.count -= 1;
    };
    LinkedList.prototype.each = function (callback) {
        var node = this.head._next;

        while (node.hasOwnProperty('_next')) {
            var next = node._next;
            callback(node);
            node = next;
        }
    };

    function forEachIn(obj, callback) {
        var index = 0;
        for (var prop in obj) {
            if (obj.hasOwnProperty(prop)) {
                if (callback(obj[prop], index, prop) === false) break;
                index += 1;
            }
        }
    }

    var getTime = (function () {
        if (window.performance) {
            return function () {
                return window.performance.now();
            };
        } else if (Date.now) {
            return function () {
                return Date.now();
            };
        } else {
            return function () {
                return new Date().getTime();
            };
        }
    }());


    /*
     * Ticker
     */
    var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
            window.webkitRequestAnimationFrame || window.oRequestAnimationFrame,
        ticker = {
            running: false,
            last: null,
            start: function () {
                if (!this.running) {
                    this.running = true;
                    ticker.last = getTime();
                    requestAnimationFrame(ticker.update);
                }
            },
            stop: function () {
                if (this.running) {
                    this.running = false;
                }
            },
            update: function (timestamp) {
                director.update(timestamp - ticker.last, ticker.last);
                ticker.last = timestamp;
                if (ticker.running) requestAnimationFrame(ticker.update);
            }
        },
        director = {
            list: new LinkedList(),
            add: function (animation) {
                if (this.list.count === 0) {
                    ticker.start();
                }
                animation.startTime = getTime();
                this.list.add(animation);
            },
            remove: function (animation) {
                this.list.remove(animation);
                if (this.list.count === 0) {
                    ticker.stop();
                }
            },
            update: function (diff, timestamp) {
                director.list.each(function (animation) {
                    animation.update(diff, timestamp - animation.startTime);
                });
                director.list.each(function (animation) {
                    animation.render();
                });
            }
        };


    /*
     * Animation
     */
    function mockup() {}

    function Animation(update, render) {
        this.startTime = null;
        this.update = typeof update === 'function' ? update : mockup;
        this.render = typeof render === 'function' ? render : mockup;
    }

    Animation.prototype.stop = function () {
        director.remove(this);
    };
    Animation.prototype.play = function () {
        director.add(this);
    };


    /*
     * Easings
     * I can't remember from where get these tweens
     */
    var ease = {
        // simple linear tweening - no easing, no acceleration
        linear: function (t, b, c, d) {
            return c * t / d + b;
        },

        // quadratic easing in - accelerating from zero velocity
        easeInQuad: function (t, b, c, d) {
            t /= d;
            return c * t * t + b;
        },

        // quadratic easing out - decelerating to zero velocity
        easeOutQuad: function (t, b, c, d) {
            t /= d;
            return -c * t * (t - 2) + b;
        },

        // quadratic easing in/out - acceleration until halfway, then deceleration
        easeInOutQuad: function (t, b, c, d) {
            t /= d / 2;
            if (t < 1) return c / 2 * t * t + b;
            t--;
            return -c / 2 * (t * (t - 2) - 1) + b;
        },

        // cubic easing in - accelerating from zero velocity
        easeInCubic: function (t, b, c, d) {
            t /= d;
            return c * t * t * t + b;
        },

        // cubic easing out - decelerating to zero velocity
        easeOutCubic: function (t, b, c, d) {
            t /= d;
            t--;
            return c * (t * t * t + 1) + b;
        },

        // cubic easing in/out - acceleration until halfway, then deceleration
        easeInOutCubic: function (t, b, c, d) {
            t /= d / 2;
            if (t < 1) return c / 2 * t * t * t + b;
            t -= 2;
            return c / 2 * (t * t * t + 2) + b;
        },

        // quartic easing in - accelerating from zero velocity
        easeInQuart: function (t, b, c, d) {
            t /= d;
            return c * t * t * t * t + b;
        },

        // quartic easing out - decelerating to zero velocity
        easeOutQuart: function (t, b, c, d) {
            t /= d;
            t--;
            return -c * (t * t * t * t - 1) + b;
        },

        // quartic easing in/out - acceleration until halfway, then deceleration
        easeInOutQuart: function (t, b, c, d) {
            t /= d / 2;
            if (t < 1) return c / 2 * t * t * t * t + b;
            t -= 2;
            return -c / 2 * (t * t * t * t - 2) + b;
        },

        // quintic easing in - accelerating from zero velocity
        easeInQuint: function (t, b, c, d) {
            t /= d;
            return c * t * t * t * t * t + b;
        },

        // quintic easing out - decelerating to zero velocity
        easeOutQuint: function (t, b, c, d) {
            t /= d;
            t--;
            return c * (t * t * t * t * t + 1) + b;
        },

        // quintic easing in/out - acceleration until halfway, then deceleration
        easeInOutQuint: function (t, b, c, d) {
            t /= d / 2;
            if (t < 1) return c / 2 * t * t * t * t * t + b;
            t -= 2;
            return c / 2 * (t * t * t * t * t + 2) + b;
        },

        // sinusoidal easing in - accelerating from zero velocity
        easeInSine: function (t, b, c, d) {
            return -c * Math.cos(t / d * (Math.PI / 2)) + c + b;
        },

        // sinusoidal easing out - decelerating to zero velocity
        easeOutSine: function (t, b, c, d) {
            return c * Math.sin(t / d * (Math.PI / 2)) + b;
        },

        // sinusoidal easing in/out - accelerating until halfway, then decelerating
        easeInOutSine: function (t, b, c, d) {
            return -c / 2 * (Math.cos(Math.PI * t / d) - 1) + b;
        },

        // exponential easing in - accelerating from zero velocity
        easeInExpo: function (t, b, c, d) {
            return c * Math.pow(2, 10 * (t / d - 1)) + b;
        },

        // exponential easing out - decelerating to zero velocity
        easeOutExpo: function (t, b, c, d) {
            return c * ( -Math.pow(2, -10 * t / d) + 1 ) + b;
        },

        // exponential easing in/out - accelerating until halfway, then decelerating
        easeInOutExpo: function (t, b, c, d) {
            t /= d / 2;
            if (t < 1) return c / 2 * Math.pow(2, 10 * (t - 1)) + b;
            t--;
            return c / 2 * ( -Math.pow(2, -10 * t) + 2 ) + b;
        },

        // circular easing in - accelerating from zero velocity
        easeInCirc: function (t, b, c, d) {
            t /= d;
            return -c * (Math.sqrt(1 - t * t) - 1) + b;
        },

        // circular easing out - decelerating to zero velocity
        easeOutCirc: function (t, b, c, d) {
            t /= d;
            t--;
            return c * Math.sqrt(1 - t * t) + b;
        },

        // circular easing in/out - acceleration until halfway, then deceleration
        easeInOutCirc: function (t, b, c, d) {
            t /= d / 2;
            if (t < 1) return -c / 2 * (Math.sqrt(1 - t * t) - 1) + b;
            t -= 2;
            return c / 2 * (Math.sqrt(1 - t * t) + 1) + b;
        }
    };

    /*
     * Tween
     */
    function Tween(opts) {
        var that = this;
        this.start = opts.start;
        this.end = opts.end;
        this.duration = opts.duration || 0;
        this.easing = ease[opts.ease || 'linear'];
        this._reverse = false;
        this.delay = opts.delay || 0;
        this._events = {};
        this.data = {};
        this.registerEventNames('play', 'pause', 'update', 'reverse', 'start', 'end');
        this.render = opts.render || mockup;
        this.setAmount();
        this._animation = new Animation(function (diff, progress) {
            that.update.call(that, diff, progress);
        }, function () {
            that.render.call(that);
        });
        this.goStart();
    }
    Tween.prototype.setAmount = function () {
        var that = this;
        this.amount = {};

        forEachIn(this.start, function (val, index, propName) {
            that.amount[propName] = that.end[propName] - val;
        });
    };

    Tween.prototype.update = function (diff) {
        var that = this;
        if (diff < 0) diff = 0;
        if (this._reverse) diff = -diff;

        this._progress = this._progress + diff;

        if (this._progress >= this.duration && !this._reverse) {
            this._animation.stop();
            this._progress = this.duration;
            forEachIn(this.end, function (val, index, propName) {
                that.data[propName] = val;
            });
            this.render();
            this.emit('end');
        } else if (this._progress <= 0 && this._reverse) {
            this._animation.stop();
            this._progress = 0;
            forEachIn(this.start, function (val, index, propName) {
                that.data[propName] = val;
            });
            this.render();
            this.emit('start');
        } else {
            forEachIn(this.start, function (val, index, propName) {
                that.data[propName] = that.easing(that._progress, that.start[propName], that.amount[propName], that.duration);
            });
            this.emit('update');
        }
    };
    Tween.prototype.goStart = function () {
        this._progress = 0;
        this.update(0);
        this.render();
    };
    Tween.prototype.goEnd = function () {
        this._progress = this.duration;
        this.update(0);
        this.render();
    };
    Tween.prototype.on = function (evName, func) {
        if (typeof evName !== 'string') throw 'Event name must be a [String]!';
        if (typeof func !== 'function') throw 'Callback to the event "' + evName + '" must be a [Function]!';
        if (!this._events.hasOwnProperty(evName)) throw 'The event name "' + evName + '", is not registered to the binding object!';
        this._events[evName].push(func);
    };
    Tween.prototype.registerEventNames = function () {
        for (var i = 0; i < arguments.length; i += 1) {
            if (typeof arguments[i] !== 'string') throw 'Event name as argument number ' + i + ' must be a [String]!';
            this._events[arguments[i]] = [];
        }
    };
    Tween.prototype.emit = function (evName, data) {
        var that = this;
        if (!this._events.hasOwnProperty(evName)) throw 'There is no such event "' + evName + '"!';
        this._events[evName].forEach(function (func) {
            func.call(that, {name: evName, data: data || null});
        });
    };
    Tween.prototype.play = function () {
        if (this._progress === this.duration) return;

        this._reverse = false;
        this.emit('play');
        this._animation.play();
    };
    Tween.prototype.reverse = function () {
        if (this._progress === 0) return;

        this._reverse = true;
        this.emit('reverse');
        this._animation.play();
    };
    Tween.prototype.pause = function () {
        this._animation.stop();
        this.emit('pause');
    };


    window.Animation = Animation;
    window.Tween = Tween;
}());
