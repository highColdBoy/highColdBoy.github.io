// raindrop.js

function Raindrop(x, y, speed, size, fn) {
    this.x = x;
    this.y = y;
    this.speed = speed;
    this.size = size;
    this.fn = fn;
}

Raindrop.prototype.draw = function (cxt) {
    cxt.save();
    cxt.beginPath();
    cxt.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    cxt.fillStyle = "rgba(173, 216, 230, 0.8)"; // Light blue
    cxt.fill();
    cxt.restore();
};

Raindrop.prototype.update = function () {
    this.x = this.fn.x(this.x, this.y);
    this.y = this.fn.y(this.y, this.y);

    // If the raindrop goes out of bounds, reset it
    if (this.y > window.innerHeight) {
        this.x = getRandomRaindrop("x");
        this.y = getRandomRaindrop("y");
        this.speed = getRandomRaindrop("speed");
        this.size = getRandomRaindrop("size");
    }
};

RaindropList = function () {
    this.list = [];
};
RaindropList.prototype.push = function (raindrop) {
    this.list.push(raindrop);
};
RaindropList.prototype.update = function () {
    for (let i = 0; i < this.list.length; i++) {
        this.list[i].update();
    }
};
RaindropList.prototype.draw = function (cxt) {
    for (let i = 0; i < this.list.length; i++) {
        this.list[i].draw(cxt);
    }
};
RaindropList.prototype.size = function () {
    return this.list.length;
};

function getRandomRaindrop(option) {
    let ret;
    switch (option) {
        case "x":
            ret = Math.random() * window.innerWidth;
            break;
        case "y":
            ret = -10; // Start raindrops above the screen
            break;
        case "speed":
            ret = 2 + Math.random() * 4; // Random speed between 2 and 6
            break;
        case "size":
            ret = 0.5 + Math.random() * 2; // Random size between 0.5 and 2.5
            break;
        case "fnx":
            ret = function (x, y) {
                return x + (Math.random() - 0.5) * 0.8; // Slight horizontal drift
            };
            break;
        case "fny":
            ret = function (x, y) {
                return y + this.speed; // Vertical speed based on random speed
            };
            break;
    }
    return ret;
}

function startRain() {
    stopRain();
    requestAnimationFrame =
        window.requestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        window.oRequestAnimationFrame;

    let canvas = document.createElement("canvas"),
        cxt;
    canvas.height = window.innerHeight;
    canvas.width = window.innerWidth;
    canvas.setAttribute(
        "style",
        "position: fixed;left: 0;top: 0;pointer-events: none;z-index: -2;"
    );
    canvas.setAttribute("id", "canvas_rain");
    document.getElementsByTagName("body")[0].appendChild(canvas);
    cxt = canvas.getContext("2d");

    const raindropList = new RaindropList();
    for (let i = 0; i < 200; i++) { // Increase the number of raindrops for a denser effect
        let raindrop, randomX, randomY, randomSpeed, randomSize, randomFnx, randomFny;
        randomX = getRandomRaindrop("x");
        randomY = getRandomRaindrop("y");
        randomSpeed = getRandomRaindrop("speed");
        randomSize = getRandomRaindrop("size");
        randomFnx = getRandomRaindrop("fnx");
        randomFny = function (x, y) {
            return y + randomSpeed; // Use the random speed for vertical motion
        };
        raindrop = new Raindrop(randomX, randomY, randomSpeed, randomSize, {
            x: randomFnx,
            y: randomFny,
        });
        raindropList.push(raindrop);
    }

    let stop = requestAnimationFrame(function () {
        cxt.clearRect(0, 0, canvas.width, canvas.height);
        raindropList.update();
        raindropList.draw(cxt);
        stop = requestAnimationFrame(arguments.callee);
    });
}

window.onresize = function () {
    const canvasRain = document.getElementById("canvas_rain");
    if (canvasRain) {
        canvasRain.width = window.innerWidth;
        canvasRain.height = window.innerHeight;
    }
};

function stopRain() {
    let child = document.getElementById("canvas_rain");
    if (child) {
        child.parentNode.removeChild(child);
        window.cancelAnimationFrame(stop);
    }
}

// Start rain effect when the script is loaded
startRain();