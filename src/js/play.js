/*global Game*/

/**
 * Returns a random integer between min and max
 * Using Math.round() will give you a non-uniform distribution!
 */

// // Choose Random integer in a range
// function rand (min, max) {
//     return Math.floor(Math.random() * (max - min + 1)) + min;
// }

// var musicOn = true;


var wKey;
var aKey;
var sKey;
var dKey;
var score = 0;

Game.Play = function(game) {
  this.game = game;
};

Game.Play.prototype = {
  init: function() {
    this.game.physics.startSystem(Phaser.Physics.ARCADE);
  },
  create: function() {
    this.game.world.setBounds(0, 0 ,Game.w ,Game.h);
    this.game.stage.backgroundColor = '#000';

    this.elevators = this.game.add.physicsGroup();
    this.elevators.setAll('body.allowGravity', false);

    this.platforms = this.game.add.physicsGroup();
    // this.platforms.setAll('body.allowGravity', false);

    this.powerups = this.game.add.physicsGroup();
    this.powerups.setAll('body.immovalbe', true);

    this.bumpers = this.game.add.group();

    this.game.physics.startSystem(Phaser.Physics.ARCADE);

    //Load World Map
    this.map = this.game.add.tilemap('world');
    this.map.addTilesetImage('tiles', 'tiles');

    this.map.setCollision(1);
    this.map.setCollision(2);

    this.map.setTileIndexCallback(3, this.playerDead, this);

    this.map.createFromObjects('objects', 4, this.makeBox(160, 32,'#00ff00'), 0, true, false, this.elevators);
    this.map.createFromObjects('objects', 5, this.makeBox(160, 32, '#ffff00'), 0, true, false, this.platforms);
    this.map.createFromObjects('objects', 7, 'shapes', 0, true, false, this.powerups);
    
    this.layer = this.map.createLayer('layer1');
    this.layer.resizeWorld();
    this.loadObjects();

    // this.player = new Player(this.game, Game.w/2, Game.h/2);
    this.player = new Player(this.game, 2000, 1216); 

    // // Music
    // this.music = this.game.add.sound('music');
    // this.music.volume = 0.5;
    // this.music.play('',0,1,true);



    //Set Gamera to screen 6
    // console.log(Game.camera.x)
    this.game.camera.x = Game.camera.x*Game.w;
    this.game.camera.y = Game.camera.y*Game.h;

    //Create Twitter button as invisible, show during win condition to post highscore
    this.twitterButton = this.game.add.button(this.game.world.centerX, this.game.world.centerY + 200,'twitter', this.twitter, this);
    this.twitterButton.anchor.set(0.5);
    this.twitterButton.visible = false;
  },
  playerDead: function() {
    this.player.reset(2000, 1216);
  },
  loadObjects: function() {
    this.elevators.forEach(function(e) {
      // e.anchor.set(0,0.5);
      e.body.immovable = true;

      if (e.distance !== undefined) {
        var t = this.game.add.tween(e).to({y: (e.distance*32*e.direction*(-1)).toString()}, (e.distance*300)).to({y: (e.distance*32*e.direction).toString()}, (e.distance*300));
       t.loop(true).start(); 
      }
    }, this);

    
    this.platforms.forEach(function(p) {
      // p.body.velocity.x = p.speed;
			console.log(p.direction);

			p.addMotionPath = function(motionPath) {
				this.tweenX = this.game.add.tween(this.body);
				this.tweenY = this.game.add.tween(this.body);

				for(var i = 0; i < motionPath.length; i++) {
				console.log(motionPath[i].y);
					this.tweenX.to({x: motionPath[i].x}, motionPath[i].xSpeed, motionPath[i].xEase);
					this.tweenY.to({y: motionPath[i].y}, motionPath[i].ySpeed, motionPath[i].yEase);
				}
				this.tweenX.loop();
				this.tweenY.loop();
			};
			p.start = function() {
				this.tweenX.start();
				this.tweenY.start();
			};

      p.body.immovable = true;

      p.addMotionPath([
				{ x: "+100", xSpeed: 2000, xEase: "Linear", y: "+0", ySpeed: 2000, yEase: "Sine.easeIn" },
				{ x: "-100", xSpeed: 2000, xEase: "Linear", y: "-0", ySpeed: 2000, yEase: "Sine.easeOut" }
			]);
			p.start();

      // p.body.velocity.x = parseInt(p.speed*p.direction);
      // e.anchor.set(0.5);
      // e.body.immovable = true;
      //
      // if (e.distance !== undefined) {
      //   // var t = this.game.add.tween(e).to({x: (e.distance*32*e.direction*(-1)).toString()}, (e.distance*300)).to({x: (e.distance*32*e.direction).toString()}, (e.distance*300));
      //  //  var t = this.game.add.tween(e).to({x: -100}, 1500).to({x: 100}, 1500);
      //  // t.loop(true).start(); 
      //
      //   this.game.add.tween(e.body.velocity).to( { x: e.distance*32, y: 0 }, 1500, Phaser.Easing.Elastic.Out ).to( { x: e.distance*32*(-1), y: 0 }, 1500, Phaser.Easing.Elastic.Out).yoyo().loop().start();
      //
      //
      //
      //
      // }
    }, this);


    this.powerups.forEach(function(p) {
      p.frame = parseInt(p.index);
      console.log(p.index);

      p.anchor.setTo(0.5);
      p.y += p.height/2;
      var t = this.game.add.tween(p).to({y: '-5'}, 400).to({y: '+5'}, 400);
      t.loop(true).start();  
    },this);
  },

  update: function() {

    this.game.physics.arcade.collide(this.player, this.layer);
    this.game.physics.arcade.collide(this.player, this.elevators);
    // this.game.physics.arcade.collide(this.player, this.platforms, this.setFriction, null, this);
    this.game.physics.arcade.collide(this.player, this.platforms);
    //
    // this.game.physics.arcade.overlap(this.platforms, this.bumpers, this.bouncePlatform, null, this);
    // this.game.physics.arcade.collide(this.platforms, this.layer, this.bouncePlatform, null, this);


    this.game.physics.arcade.overlap(this.player, this.powerups, this.pickupPowerup, null, this);

    this.player.movements();
    this.player.updateCamera();

    // // Toggle Music
    // muteKey.onDown.add(this.toggleMute, this);
  },
  // setFriction: function(player, platform) {
  //   // player.body.x -= platform.body.x - platform.body.prev.x; 
  //   player.body.x = player.body.x + (platform.body.x - player.body.x); 
  // },
  bouncePlatform: function(platform, bumper) {
    console.log(platform.direction);
    if (platform.direction < 0) {
      platform.body.velocity.x = platform.speed;
    }else {
      platform.body.velocity.x = -platform.speed;
    }
    platform.direction = platform.direction * -1;
    // platform.direction *= -1;
    // platform.body.velocity.x *= -1;
  },
  pickupPowerup: function(player, powerup) {
    if (powerup.frame === 1) {
      player.triangleUnlocked = true;
      console.log('picked up triangle');
      powerup.kill();
    }
  },
  makeBox: function(x,y, color) {
    var bmd = this.game.add.bitmapData(x, y);
    bmd.ctx.beginPath();
    bmd.ctx.rect(0, 0, x, y);
    bmd.ctx.fillStyle = color;
    // bmd.ctx.fillStyle = '#00ff00';
    bmd.ctx.fill();
    return bmd;
  },
  twitter: function() {
    //Popup twitter window to post highscore
    var game_url = 'http://www.divideby5.com/games/GAMETITLE/'; 
    var twitter_name = 'rantt_';
    var tags = ['LDJAM'];

    window.open('http://twitter.com/share?text=My+best+score+is+'+score+'+playing+GAME+TITLE+See+if+you+can+beat+it.+at&via='+twitter_name+'&url='+game_url+'&hashtags='+tags.join(','), '_blank');
  },

  // toggleMute: function() {
  //   if (musicOn == true) {
  //     musicOn = false;
  //     this.music.volume = 0;
  //   }else {
  //     musicOn = true;
  //     this.music.volume = 0.5;
  //   }
  // },
  // render: function() {
  //   game.debug.text('Health: ' + tri.health, 32, 96);
  // }

};
