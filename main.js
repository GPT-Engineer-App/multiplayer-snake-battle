const CELL_SIZE = 20;
const CANVAS_SIZE = 400;
const REDRAW_INTERVAL = 50;
const WIDTH = CANVAS_SIZE / CELL_SIZE;
const HEIGHT = CANVAS_SIZE / CELL_SIZE;
const DIRECTION = {
  LEFT: 0,
  RIGHT: 1,
  UP: 2,
  DOWN: 3,
};

let snake1 = initSnake();
let snake2 = initSnake();

let apple1 = initApple();
let apple2 = initApple();

let score1 = 0;
let score2 = 0;

function initPosition() {
  return {
    x: Math.floor(Math.random() * WIDTH),
    y: Math.floor(Math.random() * HEIGHT),
  };
}

function initHeading() {
  return Math.floor(Math.random() * 4);
}

function initSnake() {
  return {
    body: [initPosition()],
    heading: initHeading(),
  };
}

function initApple() {
  return initPosition();
}

function updateSnake(snake) {
  const head = snake.body[0];
  const newHead = { x: head.x, y: head.y };

  switch (snake.heading) {
    case DIRECTION.LEFT:
      newHead.x -= 1;
      break;
    case DIRECTION.RIGHT:
      newHead.x += 1;
      break;
    case DIRECTION.DOWN:
      newHead.y += 1;
      break;
    case DIRECTION.UP:
      newHead.y -= 1;
      break;
  }

  snake.body.unshift(newHead);
  snake.body.pop();
}

function drawCell(ctx, x, y) {
  ctx.fillRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
}

function drawSnake(ctx, snake) {
  ctx.fillStyle = "limegreen";
  snake.body.forEach((cell) => drawCell(ctx, cell.x, cell.y));
}

function drawApple(ctx, apple) {
  ctx.fillStyle = "red";
  drawCell(ctx, apple.x, apple.y);
}

function draw() {
  const canvas = document.getElementById("gameCanvas");
  const ctx = canvas.getContext("2d");

  ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

  drawSnake(ctx, snake1);
  drawSnake(ctx, snake2);
  drawApple(ctx, apple1);
  drawApple(ctx, apple2);
}

function teleport(snake) {
  if (snake.body[0].x < 0) {
    snake.body[0].x = WIDTH - 1;
  }
  if (snake.body[0].x >= WIDTH) {
    snake.body[0].x = 0;
  }
  if (snake.body[0].y < 0) {
    snake.body[0].y = HEIGHT - 1;
  }
  if (snake.body[0].y >= HEIGHT) {
    snake.body[0].y = 0;
  }
}

function eat(snake, apple, score) {
  if (snake.body[0].x === apple.x && snake.body[0].y === apple.y) {
    snake.body.push({ ...snake.body[snake.body.length - 1] });
    apple.x = Math.floor(Math.random() * WIDTH);
    apple.y = Math.floor(Math.random() * HEIGHT);
    score++;
  }
  return score;
}

function hasCollision(snakes) {
  let isCollision = false;

  snakes.forEach((snake) => {
    for (let i = 1; i < snake.body.length; i++) {
      if (snake.body[i].x === snake.body[0].x && snake.body[i].y === snake.body[0].y) {
        isCollision = true;
      }
    }
  });

  snakes.forEach((snake1) => {
    snakes.forEach((snake2) => {
      if (snake1 !== snake2) {
        if (snake1.body[0].x === snake2.body[0].x && snake1.body[0].y === snake2.body[0].y) {
          isCollision = true;
        }
      }
    });
  });

  return isCollision;
}

function displayMessage(message) {
  document.getElementById("message").textContent = message;
}

function updateScores() {
  document.getElementById("score1").textContent = score1;
  document.getElementById("score2").textContent = score2;
}

function update() {
  updateSnake(snake1);
  updateSnake(snake2);
  teleport(snake1);
  teleport(snake2);

  score1 = eat(snake1, apple1, score1);
  score2 = eat(snake2, apple2, score2);

  if (hasCollision([snake1, snake2])) {
    displayMessage("Game Over");
    return;
  }

  updateScores();
}

function move(snake, direction) {
  if (Math.abs(snake.heading - direction) !== 2) {
    snake.heading = direction;
  }
}

document.addEventListener("keydown", function (e) {
  switch (e.key) {
    case "w":
      move(snake1, DIRECTION.UP);
      break;
    case "d":
      move(snake1, DIRECTION.RIGHT);
      break;
    case "s":
      move(snake1, DIRECTION.DOWN);
      break;
    case "a":
      move(snake1, DIRECTION.LEFT);
      break;
    case "ArrowUp":
      move(snake2, DIRECTION.UP);
      break;
    case "ArrowRight":
      move(snake2, DIRECTION.RIGHT);
      break;
    case "ArrowDown":
      move(snake2, DIRECTION.DOWN);
      break;
    case "ArrowLeft":
      move(snake2, DIRECTION.LEFT);
      break;
  }
});

function gameLoop() {
  update();
  draw();
}

setInterval(gameLoop, REDRAW_INTERVAL);
