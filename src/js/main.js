/**
 * Created by Ivan on 27.12.2014 г..
 */

(function () {


    var els = [],
        tweens = [],
        container = document.getElementById('container'),
        top = 0;

    for (var i = 0; i < 30; i += 1) {
        els.push(document.createElement('div'));
        els[i].className = 'item';
        els[i].style.top = top + 'px';
        top += 22;
        container.appendChild(els[i]);
    }

    els.forEach(function (item) {
        var top = parseInt(item.style.top);
        tweens.push(new Tween({
            start: {left: 0, top: top, borderRadius: 0},
            end: {left: 700, top: top + 30, borderRadius: 10},
            duration: 2000,
            delay: 0,
            ease: 'easeInOutCubic',
            render: function () {
                //item.style.left = Math.round(this.data.left) + 'px';
                //item.style.top = Math.round(this.data.top) + 'px';
                //item.style.borderRadius = Math.round(this.data.borderRadius) + 'px';

                for (var prop in this.data) {
                    if (this.data.hasOwnProperty(prop)) {
                        item.style[prop] = Math.round(this.data[prop]) + 'px';
                    }
                }
            }
        }));
    });

    tweens[29].on('end', reverse);
    tweens[29].on('start', play);


    function play() {
        tweens.forEach(function (item) {
            item.play();
        });
    }

    function reverse() {
        tweens.forEach(function (item) {
            item.reverse();
        });
    }

    document.getElementById('play').addEventListener('click', play);
    document.getElementById('pause').addEventListener('click', function () {
        tweens.forEach(function (item) {
            item.pause();
        });
    });
    document.getElementById('reverse').addEventListener('click', reverse);
    document.getElementById('gostart').addEventListener('click', function () {
        tweens.forEach(function (item) {
            item.goStart();
        });
    });
    document.getElementById('goend').addEventListener('click', function () {
        tweens.forEach(function (item) {
            item.goEnd();
        });
    });

}());
