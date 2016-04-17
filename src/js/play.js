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
    this.game.stage.backgroundColor = '#dcdcdc';


    // console.log(Game.camera.x*Game.w);
    // this.game.camera.position = Phaser.Point(Game.camera.x*Game.w, Game.camera.y*Game.h);


    this.game.physics.startSystem(Phaser.Physics.ARCADE);
    //Load World Map

    this.map = this.game.add.tilemap('world');
    this.map.addTilesetImage('tiles', 'tiles');

    this.map.setCollision(1);
    this.map.setCollision(2);

    this.layer = this.map.createLayer('layer1');
    this.layer.resizeWorld();

    // this.player = new Player(this.game, Game.w/2, Game.h/2);
    this.player = new Player(this.game, 1216, 1216); 

    // // Music
    // this.music = this.game.add.sound('music');
    // this.music.volume = 0.5;
    // this.music.play('',0,1,true);



    //Set Gamera to screen 6
    this.game.camera.x = Game.camera.x*Game.w;
    this.game.camera.y = Game.camera.y*Game.h;

    //Create Twitter button as invisible, show during win condition to post highscore
    this.twitterButton = this.game.add.button(this.game.world.centerX, this.game.world.centerY + 200,'twitter', this.twitter, this);
    this.twitterButton.anchor.set(0.5);
    this.twitterButton.visible = false;
  },

  update: function() {

    this.game.physics.arcade.collide(this.player, this.layer);

    this.player.movements();
    this.player.updateCamera();

    // // Toggle Music
    // muteKey.onDown.add(this.toggleMute, this);

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
