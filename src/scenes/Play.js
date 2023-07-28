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
        // Variables
        this.maxYVel = 3000;
        this.jumpVelocity = -700;
        this.stageSpeed = 10;
        this.moving = true;
        this.railMultiplier = 2;

        // Score
        this.score = 0;
        this.displayScore;
        let scoreConfig = {
            fontFamily: 'Courier',
            fontSize: '20px',
            backgroundColor: '#F3B141',
            color: '#843605',
            align: 'right',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 100
        }
        this.scoreText = this.add.text(game.config.width - game.config.width / 4.5, game.config.height / 15, this.displayScore, scoreConfig);

        // Player
        this.player = this.physics.add.sprite(this.game.config.width / 10, game.config.height - game.config.height / 2, 'skater').setOrigin(0.5, 0);
        this.player.setMaxVelocity(500, this.maxYVel);

        this.jumping = false;

        // Adding the ground
        this.ground = this.add.group();
        this.tiles = [];

        this.ground1 = this.physics.add.sprite(-16, game.config.height - 64, 'ground1').setOrigin(0);
        this.ground1.body.immovable = true;
        this.ground1.body.allowGravity = false;
        this.ground.add(this.ground1);

        //this.tile1 = this.physics.add.sprite(game.config.width - 32, game.config.height - 96, 'tiles', 7).setOrigin(0.25, 0);
        this.tile1 = new Tile(this, game.config.width - 32, game.config.height - 96, 'tiles', 7, 5).setOrigin(0.25, 0);
        this.tile1.body.immovable = true;
        this.tile1.body.allowGravity = false;
        this.ground.add(this.tile1);
        this.tiles.push(this.tile1);

        //this.tile2 = this.physics.add.sprite(game.config.width - 64, game.config.height - 96, 'tiles', 7).setOrigin(0.25, 0);
        this.tile2 = new Tile(this, game.config.width - 64, game.config.height - 96, 'tiles', 7, 5).setOrigin(0.25, 0);
        this.tile2.body.immovable = true;
        this.tile2.body.allowGravity = false;
        this.ground.add(this.tile2);
        this.tiles.push(this.tile2);

        this.physics.add.collider(this.player, this.ground);
      
        // Player animations
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

        // Score
        this.score += delta * 0.002;
        this.displayScore = Math.round(this.score);
        this.scoreText.text = this.displayScore;

        // PLAYER MOVEMENT
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

        /*if (this.player.body.touching.right) {
            console.log('bump');
            this.moving = false;
            //for (let tile of this.tiles) {
            //     tile.body.setVelocityX(0);
            //}
        }*/

        // TILES
        for (let tile of this.tiles) {
            // collisions
            /*if (this.checkCollision(this.player, tile)) {
                console.log('collision');
                this.moving = false;
            }*/
            if (tile.checkCollision(this.player)) {
                this.moving = false;
            }
            // scoring
            if (!tile.scored && tile.x < this.player.x) {
                this.score += tile.scoreValue;
                tile.scored = true;
            }
        }
        //for
        

        // TILE MOVEMENT
        if (this.moving) {
            for (let tile of this.tiles) {
                //tile.body.setVelocityX(-this.stageSpeed);
                tile.x -= this.stageSpeed;
            }
        }
    }

    checkCollision(player, other) {
        // simple AABB checking (Axis-Aligned Bounding Boxes)
        if (player.x < other.x + other.width &&
            player.x + player.width > other.x &&
            player.y < other.y + other.height &&
            player.height + player.y > other.y) {
                return true;
        } else {
            return false;
        }
    }
}