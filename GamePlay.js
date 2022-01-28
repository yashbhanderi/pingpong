const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

var speed = localStorage.getItem("speed");
localStorage.removeItem("speed");

// some sounds
const ballHitRacket = new Audio("../audio/ballHitRacket.wav");
const playerScored = new Audio("../audio/playerScored.wav");
const ballHitWall = new Audio("../audio/ballHitWall.wav");

// variables
const racketWidth = 10;
const racketHeight = 100;
const netWidth = 4;
const netHeight = canvas.height;

let upArrowKeyPressed = false;
let downArrowKeyPressed = false;
// const upArrowClick = document.getElementById("upArrowClick");
// const downArrowClick = document.getElementById("downArrowClick");

let score = 0;
let life = 3;

// objects
const net = {
    x: canvas.width / 2 - netWidth / 2,
    y: 0,
    width: netWidth,
    height: netHeight,
    color: "#FFF",
};

const player = {
    x: 10,
    y: canvas.height / 2 - racketHeight / 2,
    width: racketWidth,
    height: racketHeight,
    color: "#FFF",
};

const auto = {
    x: canvas.width - (racketWidth + 10),
    y: canvas.height / 2 - racketHeight / 2,
    width: racketWidth,
    height: racketHeight,
    color: "#FFF",
};

const ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: 7,
    speed: 7,
    velocityX: 5,
    velocityY: 5,
    color: "#ff5917",
};

// drawing functions
function drawNet() {
    ctx.fillStyle = net.color;
    ctx.fillRect(net.x, net.y, net.width, net.height);
}

function drawText(x, y, value, property) {
    ctx.fillStyle = "#fff";
    ctx.font = "35px 'Share Tech Mono', monospace";
    if (property === "score") ctx.fillText(`Score : ${value}`, x, y);
    else ctx.fillText(`Life : ${value}`, x, y);
}

function drawRacket(x, y, width, height, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, width, height);
}

function drawBall(x, y, radius, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.fill();
}

// Key Handlers
window.addEventListener("keydown", keyDownHandler);
window.addEventListener("keyup", keyUpHandler);

$("#upArrowClick").click(function () {
    upArrowKeyPressed = true;
    downArrowKeyPressed = false;
});
$("#downArrowClick").focus(function () {
    downArrowKeyPressed = true;
    upArrowKeyPressed = false;
});

$(document).click(function (e) {
    if (!$(e.target).is("#upArrowClick")) upArrowKeyPressed = false;
    if (!$(e.target).is("#downArrowClick")) downArrowKeyPressed = false;
});

function keyDownHandler(e) {
    switch (e.keyCode) {
        case 38:
            upArrowKeyPressed = true;
            break;
        case 40:
            downArrowKeyPressed = true;
            break;
    }
}

function keyUpHandler(e) {
    switch (e.keyCode) {
        case 38:
            upArrowKeyPressed = false;
            break;
        case 40:
            downArrowKeyPressed = false;
            break;
    }
}

// reset the ball

const btn__home = document.querySelector(".btn__home");
const btn__restart = document.querySelector(".btn__restart");
btn__home.addEventListener(onclick, () => {
    location.href("index.html");
});

function reset() {
    // reset ball's value to older values
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.speed = 7;

    // changes the direction of ball
    ball.velocityX = -ball.velocityX;
    ball.velocityY = -ball.velocityY;
}

// collision Detect function
function collisionDetection(user, ball) {
    // returns true or false
    user.top = user.y;
    user.right = user.x + user.width;
    user.bottom = user.y + user.height;
    user.left = user.x;

    ball.top = ball.y - ball.radius;
    ball.right = ball.x + ball.radius;
    ball.bottom = ball.y + ball.radius;
    ball.left = ball.x - ball.radius;

    return (
        ball.left < user.right &&
        ball.top < user.bottom &&
        ball.right > user.left &&
        ball.bottom > user.top
    );
}

// update function, to update things position
function update() {
    // move the paddle
    if (upArrowKeyPressed && player.y > 0) {
        player.y -= 8;
    } else if (downArrowKeyPressed && player.y < canvas.height - player.height) {
        player.y += 8;
    }

    // check if ball hits top or bottom wall
    if (ball.y + ball.radius >= canvas.height || ball.y - ball.radius <= 0) {
        // play ballHitWall
        ballHitWall.play();
        ball.velocityY = -ball.velocityY;
    }

    // if ball hit on right wall
    if (ball.x + ball.radius >= canvas.width) {
        // play playerScored
        playerScored.play();
        // then player scored 1 point
        score += 100;
        reset();
    }

    // if ball hit on left wall
    if (ball.x - ball.radius <= 0) {
        // play playerScored
        playerScored.play();
        // then auto scored 1 point
        // auto.score += 1;
        life -= 1;
        reset();
        return;
    }

    // move the ball
    ball.x += ball.velocityX;
    ball.y += ball.velocityY;

    // auto paddle movement
    auto.y += (ball.y - (auto.y + auto.height / 2)) * 0.6;

    // collision detection on paddles
    let user = ball.x < canvas.width / 2 ? player : auto;

    if (collisionDetection(user, ball)) {
        // play ballHitRacket
        ballHitRacket.play();
        if (ball.x < canvas.width / 2) score += 10;
        // default angle is 0deg in Radian
        let angle = 0;

        // if ball hit the top of paddle
        if (ball.y < user.y + user.height / 2) {
            // then -1 * Math.PI / 4 = -45deg
            angle = (-1 * Math.PI) / 4;
        } else if (ball.y > user.y + user.height / 2) {
            // if it hit the bottom of paddle
            // then angle will be Math.PI / 4 = 45deg
            angle = Math.PI / 4;
        }

        /* change velocity of ball according to on which paddle the ball hitted */
        ball.velocityX = (user === player ? 1 : -1) * ball.speed * Math.cos(angle);
        ball.velocityY = ball.speed * Math.sin(angle);

        // increase ball speed

        ball.speed += speed === "slow" ? 0.2 : speed == "medium" ? 0.3 : 0.4;
        console.log(ball.speed);
    }
}

// draw on to canvas
function render() {
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    drawNet();
    drawText(canvas.width / 6, canvas.height / 6, score, "score");
    drawText((4 * canvas.width) / 6, canvas.height / 6, life, "life");
    drawRacket(player.x, player.y, player.width, player.height, player.color);
    drawRacket(auto.x, auto.y, auto.width, auto.height, auto.color);
    drawBall(ball.x, ball.y, ball.radius, ball.color);
}

var loop = null;
var isGameStart = false;

function gameOver() {
    let lastHighestScore = localStorage.getItem("highestScore");
    let highestScore = null;
    let date = null;
    if(score>lastHighestScore) {
        highestScore = score;
        date = getDate();
        localStorage.setItem("highestScore", highestScore);
        localStorage.setItem("date", date);
    }
    score = 0;
    life = 3;
    isGameStart = false;
    clearInterval(loop);
    alert(`Game Over | Your Highest Score is  = ${highestScore} on ${date}`);
    // cancelAnimationFrame(loop);
}

function gamePlay() {
    if (life == 0) {
        gameOver();
        gameStart();
    }
    update();
    render();
    // requestAnimationFrame(gamePlay)
}

// calls gameLoop() function 60 times per second
gamePlay();

function gameStart(e) {
    // setTimeout(() => {
    if (!isGameStart && e.keyCode == 13) {
        loop = setInterval(gamePlay, 1000 / 60);
        isGameStart = true;
    }
    // loop = requestAnimationFrame(gamePlay);
    // }, 300000000000000);
}

window.addEventListener("keydown", gameStart);

const restartGame = () => {
    score = 0;
    life = 3;
    isGameStart = false;
    clearInterval(loop);
    reset();
    gamePlay();
    gameStart();
};

const getDate = () => {
    let DT = new Date();
    let utc = DT.getTime() + DT.getTimezoneOffset() * 60000;
    let today = new Date(utc + 3600000 * +5.5);
    let time =
        today.getDate() +
        "/" +
        (today.getMonth() + 1) +
        "/" +
        today.getFullYear() +
        "|" +
        today.getHours() +
        ":" +
        today.getMinutes() +
        ":" +
        today.getSeconds();
    return time;
};