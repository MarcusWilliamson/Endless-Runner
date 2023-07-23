class Play extends Phaser.Scene {
    constructor() {
        super("playScene");
    }

    preload() {
        // load images
        this.load.image('slime', './assets/slime.png');
        this.load.spritesheet('skater', './assets/skaterSprites.png', {frameWidth: 32, frameHeight: 32});
        this.load.image('ground1', './assets/ground1.png');
        this.load.spritesheet('tiles', './assets/tiles.png', {frameWidth: 32, frameHeight: 32});
    }

    create() {
        // add slime (player)
        //this.playerSlime = new Slime(this, game.config.width / 15, game.config.height - game.config.height / 15, 'slime').setOrigin(0.5, 0);
        this.maxYVel = 3000;
        this.jumpVelocity = -1000;

        this.player = this.physics.add.sprite(this.game.config.width / 10, game.config.height - game.config.height / 2, 'skater').setOrigin(0.5, 0);
        this.player.setMaxVelocity(500, this.maxYVel);

        this.jumping = false;

        this.ground = this.physics.add.sprite(0, game.config.height - 64, 'ground1').setOrigin(0);
        this.ground.body.immovable = true;
        this.ground.body.allowGravity = false;
        this.physics.add.collider(this.player, this.ground);
        
        this.anims.create({
            key: 'cruise',
            frames: this.anims.generateFrameNumbers('skater', {start: 0, end: 3}),
            frameRate: 14,
            repeat: -1
        })
        this.player.play('cruise');

        this.anims.create({
            key: 'jump',
            frames: this.anims.generateFrameNumbers('skater', {start: 4, end: 9}),
            frameRate: 14,
            repeat: 0
        })

        // define keys
        keySPACE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    }

    update(time, delta) {
        console.log(this.jumping);
        if (this.player.body.touching.down) {
            // If on ground but jumping is true, set to false and start cruise animation
            if (this.jumping) {
                this.jumping = false;
                this.player.play('cruise');
            }
        
        // If not on ground, jumping = true
        } else {
            this.jumping = true;
        }

        if(Phaser.Input.Keyboard.JustDown(keySPACE) && !this.jumping) {
            this.player.body.setVelocityY(this.jumpVelocity);
            this.jumping = true;
            this.player.play('jump');
        }

    }
}