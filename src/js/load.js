var tileSize = 32;

var rows = 20,
    cols = 25;

var Game = {
  w: tileSize * cols,
  h: tileSize * rows,
  camera: {x:2, y:1}
};

// var Game = {
//   w: 800,
//   h: 600
// };

// var w = 800;
// var h = 600;

Game.Boot = function(game) {
  this.game = game;
};

Game.Boot.prototype = {
  preload: function() {
    // console.log('blah'+Game.w);
		this.game.stage.backgroundColor = '#FFF';
		this.game.load.image('loading', 'assets/images/loading.png');
		this.game.load.image('title', 'assets/images/title.png');
		this.game.load.image('instructions', 'assets/images/instructions.png');
    this.game.load.bitmapFont('minecraftia', 'assets/fonts/font.png', 'assets/fonts/font.xml'); //load default font


    // //Scale Image to Fit Window
    // this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    // this.game.scale.maxHeight = window.innerHeight;
    // this.game.scale.maxWidth = window.innerHeight*(Game.w/Game.h);

  },
  create: function() {
   this.game.state.start('Load');
  }
};

Game.Load = function(game) {
  this.game = game;
};

Game.Load.prototype = {
  preload: function() {
    
    //Debug Plugin
    // this.game.add.plugin(Phaser.Plugin.Debug);

    //Loading Screen Message/bar
    var loadingText = this.game.add.bitmapText(Game.w/2, Game.h/2, 'minecraftia', 'Loading...', 30).anchor.setTo(0.5);
  	var preloading = this.game.add.sprite(Game.w/2-64, Game.h/2+50, 'loading');
  	this.game.load.setPreloadSprite(preloading);

    //Load button for twitter
    this.game.load.image('twitter','assets/images/twitter.png');
    this.game.load.spritesheet('shapes', 'assets/images/shapes.png', 48, 48, 3);
    this.game.load.spritesheet('tiles', 'assets/images/tiles.png', 32, 32, 3);

    this.game.load.tilemap('world', 'assets/atlas/world.json', null, Phaser.Tilemap.TILED_JSON);
    // this.game.load.tilemap('world', 'assets/atlas/test.json', null, Phaser.Tilemap.TILED_JSON);

    // Music Track
    // this.game.load.audio('music','soundtrack.mp3');

  },
  create: function() {
    this.game.state.start('Menu');
  }
};
