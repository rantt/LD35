var Player = function(game, x, y) {
  this.game = game;

  this.jumpSnd = this.game.add.sound('jump');
  this.jumpSnd.volume = 0.3;

  this.JUMP_SPEED = -550;
  this.MOVE_SPEED = 300;

  this.triangleUnlocked = false;

  this.bowtieUnlocked = false;

	this.circleUnlocked = false;

	this.doubleJumpUnlocked = false;

  this.standing = false;
  this.jumping = false;

  Phaser.Sprite.call(this, this.game, x, y, 'shapes', 0);
  this.game.add.existing(this);


  //Load Physics
  this.game.physics.arcade.enable(this);
  this.anchor.setTo(0.5, 0.5);
  // this.body.setSize(10, 18);
  this.body.collideWorldBounds = true;
  this.body.gravity.y = 750;
  // this.game.camera.follow(this, Phaser.Camera.FOLLOW_PLATFORMER);


  this.game.input.keyboard.addKeyCapture([
      Phaser.Keyboard.LEFT,
      Phaser.Keyboard.RIGHT,
      Phaser.Keyboard.UP,
      Phaser.Keyboard.DOWN
  ]);

};

Player.prototype = Object.create(Phaser.Sprite.prototype);

Player.prototype.leftInputIsActive = function() {
  var isActive = false;
  isActive = this.game.input.keyboard.isDown(Phaser.Keyboard.A);  
  isActive |= this.game.input.keyboard.isDown(Phaser.Keyboard.LEFT);  
  return isActive;
};

Player.prototype.rightInputIsActive = function() {
  var isActive = false;
  isActive = this.game.input.keyboard.isDown(Phaser.Keyboard.D);  
  isActive |= this.game.input.keyboard.isDown(Phaser.Keyboard.RIGHT);  
  return isActive;
};

Player.prototype.upInputIsActive = function(duration) {
  var isActive = false;
  isActive = this.game.input.keyboard.downDuration(Phaser.Keyboard.W, duration);
  isActive |= this.game.input.keyboard.downDuration(Phaser.Keyboard.UP, duration);
  return isActive;
};

Player.prototype.upInputRelease = function() {
  var released = false;
  released = this.game.input.keyboard.upDuration(Phaser.Keyboard.W);
  released |= this.game.input.keyboard.upDuration(Phaser.Keyboard.UP);
  return released;
};

Player.prototype.downInputIsActive = function() {
  var isActive = false;
  isActive = this.game.input.keyboard.isDown(Phaser.Keyboard.S);  
  isActive |= this.game.input.keyboard.isDown(Phaser.Keyboard.DOWN);  
  return isActive;
};


Player.prototype.movements = function() {
  this.standing = this.body.blocked.down || this.body.touching.down;
  this.touchingLeft = this.body.blocked.left || this.body.touching.left;
  this.touchingRight = this.body.blocked.right || this.body.touching.right;

  if (this.standing) {
      this.frame = 0;
			if (this.doubleJumpUnlocked === true) {
				this.jumps = 2;
			}else {
				this.jumps = 1;
			}
      this.jumping = false;
  }else {
		if (this.doubleJumpUnlocked === true) {
			if (this.jumps === 1) {
				this.frame = 4;
			}else {
				this.frame = 1;
			}			

    }
	 else if (this.triangleUnlocked === true) {
      this.frame = 1;
    }
  }

  if (this.leftInputIsActive()) {
    // this.facing = 'left'
    this.facing = 1; 

    if (this.standing) {this.frame = 0;}

    this.body.velocity.x = -this.MOVE_SPEED;
  }else if (this.rightInputIsActive()) {
    // this.facing = 'right'
    this.facing = -1; 

    if (this.standing) {this.frame = 0;}

    this.body.velocity.x = this.MOVE_SPEED;
  }else {
    // this.frame = 1;
    this.body.velocity.x = 0;
  }
	
	if (this.downInputIsActive()) {
		this.frame = 2;
		this.body.setSize(30, 30);
	}else {
		this.body.setSize(48, 48);
	}


	if (this.bowtieUnlocked) {
		if (this.touchingLeft && !this.standing) {
			this.sliding = true;
			this.frame = 3;
		}else if (this.touchingRight && !this.standing) {
			this.sliding = true;
			this.frame = 3;
		}else {
			this.sliding = false;
		}
	}


  if (this.jumps > 0 && this.upInputIsActive(5) && this.triangleUnlocked) {
    this.jumpSnd.play();
    this.body.velocity.y = this.JUMP_SPEED;
    this.jumping = true;
  }

  if (this.sliding && this.upInputIsActive(5) && this.bowtieUnlocked) {
    this.jumps++;

    this.game.add.tween(this).to({x: this.x+50*this.facing}, 100, Phaser.Easing.Linear.Out, true, 0); //snap in place
    this.body.velocity.y = this.JUMP_SPEED;
    this.jumping = true;
  }


  if (this.jumping && this.upInputRelease()) {
    this.jumps--;
    this.jumping = false;
  }

};


Player.prototype.updateCamera = function() {
    if (this.tweening) {
      return;
    }

    var tileSize = 32;
    this.tweening = true;
    
    // var speed = 700;
    var speed = 700;
    var toMove = false;

    if (this.y > this.game.camera.y + Game.h - tileSize) {
      // console.log(Game.camera);
      // this.y += tileSize; 
      Game.camera.y += 1;
      toMove = true;
    }
    else if (this.y < this.game.camera.y) {
      // this.y -= tileSize;
      Game.camera.y -= 1;
      toMove = true;
    }
    else if (this.x > this.game.camera.x + Game.w - tileSize) {
      // this.x += tileSize;
      Game.camera.x += 1;
      toMove = true;
    }
    else if (this.x < this.game.camera.x) {
      // this.x -= tileSize;
      Game.camera.x -= 1;
      toMove = true;
    }

    if (toMove) {
      var t = this.game.add.tween(this.game.camera).to({x:Game.camera.x*Game.w, y:Game.camera.y*Game.h}, speed);
      t.start();
      t.onComplete.add(function(){this.tweening = false;}, this);
    }
    else {
      this.tweening = false;
    }

};

Player.prototype.constructor = Player;
