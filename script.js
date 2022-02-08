var chucks = "img/chuks.png";

const canvas = document.querySelector("#canvas");
const c = canvas.getContext("2d");
const wr = document.querySelector(".wrapper");
const endScreen = document.querySelector(".end-screen");
const reset = document.querySelector(".reset");
const score = document.querySelector(".score");
canvas.width = 1024;
canvas.height = 768;
var gravity = 0.4;
var blocks = [];
var floor = [];
var start = false;
var loss = false;
var b;
var points = 0;
var chuckNum = 300;
let base_image = new Image();

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

function isCollide(a, b) {
  return !(
    a.y + a.height < b.y ||
    a.y > b.y + b.height ||
    a.x + a.width < b.x ||
    a.x > b.x + b.width
  );
}

function isCollideX(a, b) {
  return !(a.x + a.width < b.x || a.x > b.x + b.width);
}

reset.addEventListener("click", () => {
  location.reload();
});

window.onload = function () {
  var framesperSecond = 100;
  b = new Bird(canvas.width / 2, canvas.height / 2, 1, 1);
  HandleSpaceBar();
  setInterval(() => {
    c.clearRect(0, 0, canvas.width, canvas.height);
    doAll();
  }, 1000 / framesperSecond);
};

function doAll() {
  manageBlocks();
  manageFloor();
  showScore();
  birdCollision();
  b.update();
  gameOverscreen();
}

class Bird {
  constructor(x, y, dy) {
    this.x = x;
    this.y = y;
    this.dy = dy;
    this.width = 90;
    this.height = 85;
    //this.image = createImage(chuk);
  }
  draw() {
    let num = Math.floor(chuckNum / 100) * 100;
    console.log(num);
    base_image.src = chucks;
    c.drawImage(
      base_image,
      num,
      0,
      90,
      90,
      this.x,
      this.y,
      this.width,
      this.height
    );
  }
  update() {
    this.draw();
    if (this.y + this.height / 2 + this.dy < canvas.height) {
      this.dy;
      if (start) {
        this.y += this.dy;
        if (this.y >= canvas.height - 85) {
          this.dy = 0;
          gravity = 0;
          this.y = canvas.height - 85;
        }
        if (this.dy > 0 && chuckNum < 1160) {
          chuckNum += 20;
        }
        if (this.dy < 0 && chuckNum >= 60) {
          chuckNum -= 50;
        }
        this.dy += gravity;
      }
    }
  }
}

class Rect {
  constructor(x, y, dx, width, height, color, image) {
    this.x = x;
    this.y = y;
    this.dx = -dx;
    this.width = width;
    this.height = 700;
    this.color = color;
  }
  drawPipeDown() {
    let base_image = new Image();
    base_image.src = "img/Long PP.png";
    c.drawImage(base_image, this.x, this.y);
  }
  drawPipeUp() {
    let base_image = new Image();
    base_image.src = "img/Long PP copy.png";
    c.drawImage(base_image, this.x, this.y);
  }
  drawFloor() {
    let base_image = new Image();
    base_image.src = "img/Floor.png";
    c.drawImage(base_image, this.x, this.y);
  }

  update() {
    if (!loss) this.x += this.dx;
    this.drawFloor();
  }
  updatePipe() {
    if (!loss) this.x += this.dx;
    this.drawPipeDown();
  }

  updatePipeUp() {
    if (!loss) this.x += this.dx;
    this.drawPipeUp();
  }
}

function HandleSpaceBar() {
  window.addEventListener("keydown", function (evt) {
    switch (evt.keyCode) {
      case 32:
        //console.log("work?");
        event.preventDefault();
        if (loss) b.dy = 0;
        else if (b.y >= 0) b.dy = -8;
        else b.dy = 0;
        start = true;
        return true;
      case 13:
        console.log("hello");
        if (wr.style.display == "flex") {
          location.reload();
        }
      default:
        return false;
    }
  });
}

function generateBlocks() {
  var rand = getRandomInt(150, canvas.height - 250);
  blocks.push(
    new Rect(canvas.width, canvas.height - rand - 1625, 2, 140, 700),
    new Rect(canvas.width, canvas.height - rand, 2, 140, 700)
  );
}

function deleteBlocks() {
  for (let block in blocks) {
    if (blocks[block].x < -140) {
      blocks.splice(block, 1);
    }
  }
}

function manageBlocks() {
  if (start) {
    if (blocks.length == 0) {
      generateBlocks();
    } else if (blocks[blocks.length - 1].x < canvas.width / 2) {
      generateBlocks();
    }
    moveBlocks();
    deleteBlocks();
    //console.log(blocks)
  }
}

function moveBlocks() {
  for (let block in blocks) {
    if (block % 2 == 0) blocks[block].updatePipeUp();
    if (block % 2 == 1) blocks[block].updatePipe();
  }
}

function generateFloor() {
  floor.push(
    new Rect(
      floor[floor.length - 1].x + 90,
      canvas.height - 54,
      2,
      90,
      54,
      "blue"
    )
  );
  //floor.push(new Rect(floor[floor.length-1].x+canvas.width/2+90, canvas.height-54, 2, 90, 54, 'gray'))
}

function deleteFloor() {
  for (let floorPiece in floor) {
    if (floor[floorPiece].x < -90) {
      floor.splice(floorPiece, 1);
    }
  }
}

function moveFloor() {
  for (let floorPiece in floor) {
    floor[floorPiece].update();
  }
}

function manageFloor() {
  if (floor.length == 0) {
    for (let i = 0; i < 14; i++) {
      floor.push(new Rect(i * 90, canvas.height - 54, 2, 90, 54));
    }
    //floor.push(new Rect(0, canvas.height-50, 2, canvas.width/2, 70, 'blue'), new Rect(canvas.width/2, canvas.height-50, 2, canvas.width/2, 50, 'gray'), new Rect(canvas.width, canvas.height-50, 2, canvas.width/2, 70, 'blue'), new Rect(canvas.width+canvas.width/2, canvas.height-50, 2, canvas.width/2, 50, 'gray'));
  } else if (floor[1].x <= canvas.width / 2 && floor.length <= 50) {
    generateFloor();
    //console.log("hl");
  }
  //console.log(floor);
  moveFloor();
  deleteFloor();
}

function birdCollision() {
  for (let floorPiece in floor) {
    if (isCollide(b, floor[floorPiece])) {
      //location.reload();
      loss = true;
      return true;
    }
  }
  for (let block in blocks) {
    if (isCollide(b, blocks[block])) {
      //location.reload();
      loss = true;
      return true;
    }
  }
  return false;
}

function gameOverscreen() {
  if (loss) {
    wr.style.display = "flex";
    score.innerHTML = points;
    //console.log('hello')
  }
}

function showScore() {
  for (i in blocks) {
    if (b.x == blocks[i].x) points += 0.5;
  }
  c.font = "50px Roboto ";
  c.fillText(points, canvas.width / 2 - 25, 150);
}
