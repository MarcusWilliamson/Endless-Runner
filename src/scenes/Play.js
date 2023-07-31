class Play extends Phaser.Scene {
    constructor() {
        super("playScene");
    }

    preload() {
        // load images
        this.load.spritesheet('skater', './assets/skaterSprites.png', {frameWidth: 32, frameHeight: 32});
        this.load.image('ground1', './assets/ground1.png');
        this.load.spritesheet('tiles', './assets/tiles.png', {frameWidth: 32, frameHeight: 32});
        this.load.spritesheet('hazards', './assets/hazards.png', {frameWidth: 32, frameHeight: 32});
    }

    create() {
        // Variables
        this.maxYVel = 3000;
        this.jumpVelocity = -700;
        this.stageSpeed = 7;
        this.minPlatformLength = 1;
        this.maxPlatformLength = 5;
        this.maxHazardLength = 3;
        this.spawnInterval = 2000;
        this.minSpawnInterval = 800;

        this.gameOver = false;
        this.canReturnToMenu = false;

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

        // Spawn timers
        this.spawnTimer = this.spawnInterval;

        // Player
        this.player = this.physics.add.sprite(this.game.config.width / 10, game.config.height - game.config.height / 2, 'skater').setOrigin(0.5, 0);
        this.player.setMaxVelocity(500, this.maxYVel);

        this.jumping = false;

        // Adding the ground
        this.ground = this.add.group();
        this.tiles = [];
        this.platforms = this.add.group();
        
        this.ground1 = this.physics.add.sprite(-16, game.config.height - 64, 'ground1').setOrigin(0);
        this.ground1.body.immovable = true;
        this.ground1.body.allowGravity = false;
        this.ground.add(this.ground1);

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

        this.anims.create({
            key: 'fall',
            frames: this.anims.generateFrameNumbers('skater', {start: 16, end: 22}),
            frameRate: 14,
            repeat: 0
        })

        // define keys
        keySPACE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        keyR = this.input.keyboard.addKey('R');
    }

    update(time, delta) {

        // Score
        if (!this.gameOver) {
            this.score += delta * 0.001;
        }
        this.displayScore = Math.round(this.score);
        this.scoreText.text = this.displayScore;

        // Spawning
        this.spawnTimer += delta;
        if (!this.gameOver && this.spawnTimer > this.spawnInterval) {
            this.spawnTimer -= this.spawnInterval;
            if(Math.random() > 0.5) {
                this.spawnPlatform();
            } else {
                this.spawnHazard();
                //this.spawnPlatform();
            }
            if (this.spawnInterval > this.minSpawnInterval) {
                this.spawnInterval -= 200;
            }
        }

        // Player cruise animation
        if (this.player.body.touching.down) {
            // If on ground but jumping is true and gameOver is false, set to false and start cruise animation
            if (this.jumping && !this.gameOver) {
                this.jumping = false;
                this.player.play('cruise');
            }
        
        // If not on ground, jumping = true
        } else {
            this.jumping = true;
        }

        // Jumping
        if(!this.gameOver && Phaser.Input.Keyboard.JustDown(keySPACE) && !this.jumping) {
            this.player.body.setVelocityY(this.jumpVelocity);
            this.jumping = true;
            this.player.play('jump');
            this.sound.play('sfx_jump');
        }

        /*if (this.player.body.touching.right) {
            console.log('bump');
            this.gameOver = true;
            //for (let tile of this.tiles) {
            //     tile.body.setVelocityX(0);
            //}
        }*/

        // Tile collision and scoring
        for (let tile of this.tiles) {
            if (tile.checkCollision(this.player) && !this.gameOver) {
                this.endGame();
            }
            // scoring
            if (!tile.scored && tile.x < this.player.x + this.player.width && this.player.x < tile.x + tile.width) {
                if (tile.isHazard || (!tile.isHazard && tile.y - this.player.y < tile.height + 2)) {
                    this.score += tile.scoreValue;
                    //console.log(tile.scoreValue);
                    tile.scored = true;
                }
            }
            if (tile.active && tile.x < -34) {
                //this.tiles.remove()
                tile.scored = false;
                tile.setActive(false);
                tile.setVisible(false);
            }
        } 

        // Tile movement
        if (!this.gameOver) {
            for (let tile of this.tiles) {
                //tile.body.setVelocityX(-this.stageSpeed);
                tile.x -= this.stageSpeed;
            }
        }

        if(this.canReturnToMenu) {
            if(Phaser.Input.Keyboard.JustDown(keySPACE)) {
                this.sound.play('sfx_select');
                this.scene.start('menuScene');
            }
            if(Phaser.Input.Keyboard.JustDown(keyR)) {
                this.sound.play('sfx_select');
                this.scene.start('playScene');
            }
        }
    }

    // Spawn platform of random length between max and min
    spawnPlatform() {
        //console.log(this.platforms.getTotalFree());
        let size = Math.floor(Math.random() * (this.maxPlatformLength - this.minPlatformLength + 1) + this.minPlatformLength);
        for (let i = 0; i < size; i++) {
            /*let tile = new Tile(this, game.config.width + 32 * (i + 1), game.config.height - 96, 'tiles', 7, 5).setOrigin(0.25, 0);
            tile.body.immovable = true;
            tile.body.allowGravity = false;
            this.ground.add(tile);
            this.tiles.push(tile);
            */
           this.getInactiveTile(game.config.width + 32 * (i + 1), game.config.height - 96, false);
        }
    }

    // Spawn hazard
    spawnHazard() {
        let size = Math.floor(Math.random() * (this.maxHazardLength - this.minPlatformLength + 1) + this.minPlatformLength);
        for (let i = 0; i < size; i++) {
            /*let tile = new Tile(this, game.config.width + 32 * (i + 1), game.config.height - 96, 'hazards', 0, 10, true).setOrigin(0.25, 0);
            tile.body.immovable = true;
            tile.body.allowGravity = false;
            this.ground.add(tile);
            this.tiles.push(tile);*/
            this.getInactiveTile(game.config.width + 32 * (i + 1), game.config.height - 96, true);
        }
    }

    endGame() {
        let menuConfig = {
            fontFamily: 'Courier',
            fontSize: '24px',
            backgroundColor: '#F3B141',
            color: '#000000',
            align: 'right',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 0
        }

        this.gameOver = true;
        this.player.play('fall');
        this.sound.play('sfx_hurt')
        this.player.on('animationcomplete', () => {
            // Gameover screen text
            this.add.text(game.config.width / 2, game.config.height / 2 - game.config.height / 10, 'Game Over', menuConfig).setOrigin(0.5);
            this.add.text(game.config.width / 2, game.config.height / 2, 'Press R to restart', menuConfig).setOrigin(0.5);
            this.add.text(game.config.width / 2, game.config.height / 2 + game.config.height / 15, 'Press SPACE to return to menu', menuConfig).setOrigin(0.5);
            this.canReturnToMenu = true;
        });
    }

    // Gets an inactive tile and sets location. If none, creates one. (object pooling)
    getInactiveTile(x, y, hazard) {
        for (let tile of this.tiles) {
            if(!tile.active && tile.isHazard == hazard) { // Find matching inactive tile
                tile.setActive(true);
                tile.setVisible(true);
                tile.x = x;
                tile.y = y;
                //console.log('reusing');
                return tile;
            }
        }
        // If none is found, make one
        let newTile;
        if(hazard) {
            newTile = new Tile(this, x, y, 'hazards', 0, 10, true).setOrigin(0.25, 0);
        } else {
            newTile = new Tile(this, x, y, 'tiles', 7, 5).setOrigin(0.25, 0);
        }
        newTile.body.immovable = true;
        newTile.body.allowGravity = false;
        this.ground.add(newTile);
        this.tiles.push(newTile);
        //console.log('created new');
        return newTile;
    }
}