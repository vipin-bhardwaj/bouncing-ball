//<!--- mdn(developer mozilla) assignment -->

// setup canvas
var canvas, width, height;

function StartGame() {

  
  canvas = document.querySelector('canvas');
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
  
  var ctx = canvas.getContext('2d');

  // function to generate random number
  var ballCount = 0;
  const NoOfballs = 25;

  function random(min,max) {
    var num = Math.floor(Math.random()*(max-min)) + min;
    return num;
  }

  // Shape object class

  function Shape(x, y, velX, velY, exists) {
    this.x = x;
    this.y = y;
    this.velX = velX;
    this.velY = velY;
    this.exists = exists;
  }

  // ball class

  function Ball(x, y, velX, velY, color, size, exists) {
    Shape.call(this, x, y, velX, velY, exists);
    this.color = color;
    this.size = size;
  }

  // to draw the ball

  Ball.prototype.draw = function() {
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
    ctx.fill();
  };

  // evil circle

  function EvilCircle(x, y, exists) {

    Shape.call(this, x, y, 20, 20, exists);
    this.color = 'White';
    this.size = 10;
  }
  EvilCircle.prototype.draw = function() {
    ctx.beginPath();
    ctx.lineWidth = 3;
    // ctx.fillStyle = this.color;
    ctx.strokeStyle = 'White';
    ctx.arc(this.x, this.y, this.size, 0, 2* Math.PI);
    ctx.stroke();
    // ctx.fill();
  }

  EvilCircle.prototype.update = function() {
    if( (this.x + this.size) >= width) {
      // this.x = width;
      this.x = width - this.size - 10;
    }

    if((this.x - this.size) <= 0) {
      // this.x = 0;
      this.x = this.size + 10;
    }

    if((this.y + this.size) >= height) {
      this.y = height - this.size - 10;
    }

    if((this.y - this.size) <= 0) {
      this.y = this.size + 10;
    }

  }
  // ball update method

  Ball.prototype.update = function() {
    if( (this.x + this.size) >= width) {
      if((this.x + this.size) > width + this.size) {
        this.x = width - 20;
      }
      this.velX = -(this.velX);
    }

    if((this.x - this.size) <= 0) {
      // this.x = 2;
      if((this.x - this.size) <= -1* this.size) {
        this.x = 15;
      }
      this.velX = -(this.velX);
    }

    if((this.y + this.size) >= height) {
      if (this.y + this.size >= height + this.size) {
        this.y = height - 20;
      }
      this.velY = -(this.velY);
    }

    if((this.y - this.size) <= 0) {
      // this.y = 2;
      if(this.y - this.size < -1 * this.size) {
        this.y = 15;
      }
      this.velY = -(this.velY);
    }

    this.x += this.velX;
    this.y += this.velY;
  };

  //////// key controls ////////

  EvilCircle.prototype.setControls = function() {

    var _this = this;
    window.onkeydown = function(e) {
      if(e.keyCode === 65) { //A
        _this.x -= _this.velX;
      } else if(e.keyCode === 68) {
        _this.x += _this.velX; /// D
      } else if(e.keyCode === 87) {
        _this.y -= _this.velY; // S
      } else if(e.keyCode == 83) {
        _this.y += _this.velY; //// W
      }
    }

  }


  ///////////////////////////////

  ////////// Evil Circle collision /////////
  EvilCircle.prototype.collisionDetect = function() {
    for(var j = 0; j < balls.length; j++) {
      if(balls[j].exists === false) continue;
     
      var dx = this.x - balls[j].x;
      var dy = this.y - balls[j].y;
      var distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < this.size + balls[j].size) {
        balls[j].exists = false;
        ballCount += 1;
        document.querySelector('#Count').innerText = ballCount;
      }
      
    }
  }

  //////////////////


  //  ball collision detection

  Ball.prototype.collisionDetect = function() {
    for(var j = 0; j < balls.length; j++) {
      if(!(this === balls[j]) && balls[j].exists) {
        var dx = this.x - balls[j].x;
        var dy = this.y - balls[j].y;
        var distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < this.size + balls[j].size) {
          balls[j].color = this.color = 'rgb(' + random(0,255) + ',' + random(0,255) + ',' + random(0,255) +')';
        }
      }
    }
  };

  // array to store balls and populate it

  var balls = [];

  while(balls.length < NoOfballs) {
    var size = random(10,20);
    var ball = new Ball(
      // ball position always drawn at least one ball width
      // away from the adge of the canvas, to avoid drawing errors
      random(0 + size,width - size),
      random(0 + size,height - size),
      random(-7,7),
      random(-7,7),
      'rgb(' + random(0,255) + ',' + random(0,255) + ',' + random(0,255) +')',
      size,
      true
    );
    balls.push(ball);
  }

  // define loop that keeps drawing the scene constantly
  var EvilBoy = new EvilCircle(30, 30, true);

  function loop() {
    ctx.fillStyle = 'rgba(0,0,0,0.25)';
    ctx.fillRect(0,0,width,height);

    EvilBoy.draw();
    EvilBoy.update();
    EvilBoy.collisionDetect();


    for(var i = 0; i < balls.length; i++) {
      if(balls[i].exists === false) continue;
      balls[i].draw();
      balls[i].update();
      balls[i].collisionDetect();
    }

    const ramId = requestAnimationFrame(loop);
    if(ballCount == NoOfballs) {
      EndGame(ramId)
      // return;
    }
  }

  EvilBoy.setControls();
  loop();
  console.log('heelo');
}

function EndGame(ramId) {
  cancelAnimationFrame(ramId);
  const node = document.createElement('div');
  node.className = 'wrapper';
  const btn = document.createElement('button');
  btn.className = 'button';
  btn.innerText = "Game Ended, refresh to start";
  node.appendChild(btn);
  document.body.removeChild(document.querySelector('canvas'));
  document.body.appendChild(node);
}


// loop();
var flagGameStarted = false;

document.querySelector('button').onclick = function() {
  document.body.removeChild(document.querySelector('.wrapper'));
  document.querySelector('p').style.visibility = "visible";
  const canva = document.createElement('canvas');
  document.body.appendChild(canva);
  StartGame();
  flagGameStarted = true;
  // loop();
  // EndGame();
}




document.addEventListener('DOMContentLoaded', function() {
  if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mini/i.test(navigator.userAgent)) {
    // Take the user to a different screen here.
    document.querySelector('.forPhone').style.display = "block";
    document.querySelector('.wrapper').style.visibility = "hidden";
  }
});
