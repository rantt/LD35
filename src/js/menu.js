/*global Game*/
Game.Menu = function(game){
  this.game = game;
};

Game.Menu.prototype =  {
    create: function() {
		this.game.stage.backgroundColor = '#192331';

      this.titleText = this.game.add.bitmapText(Game.w/2, Game.h/2-100, 'minecraftia', "Geo Shift", 42 );
      this.titleText.anchor.setTo(0.5);
      this.titleText.tint = 0xffff00;



    this.game.add.tween(this.titleText)
      .to( {y:100 }, 2000, Phaser.Easing.Linear.In, true, 0, -1)
      .yoyo(true);

    var instructions = this.game.add.bitmapText(Game.w/2, Game.h-200, 'minecraftia', 'Controls:\nWASD/Arrows\nUnlock abilities by collecting shapes:\nRed Triangle: Jump (up)\nGreen Bowtie: Wall Jump(up when touching a wall)\nCircle: Shrink (down)\nBlue Trinagle: Double Jump (up x2)', 18);
    instructions.anchor.setTo(0.5);


        // Start Message

        var clickText = this.game.add.bitmapText(Game.w/2, Game.h/2-50, 'minecraftia', '~click to start~', 24).anchor.setTo(0.5); 

    },
    update: function() {
      //Click to Start
      if (this.game.input.activePointer.isDown){
        this.game.state.start('Play');
      }
    }
};
