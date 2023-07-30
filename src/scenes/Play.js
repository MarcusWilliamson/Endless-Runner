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
        this.jumpVelocity = -800;
        this.stageSpeed = 12;
        this.gameOver = false;
        this.minPlatformLength = 1;
        this.maxPlatformLength = 5;
        this.maxHazardLength = 3;
        this.spawnInterval = 3000;

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

        this.ground1 = this.physics.add.sprite(-16, game.config.height - 64, 'ground1').setOrigin(0);
        this.ground1.body.immovable = true;
        this.ground1.body.allowGravity = false;
        this.ground.add(this.ground1);

        //this.tile1 = this.physics.add.sprite(game.config.width - 32, game.config.height - 96, 'tiles', 7).setOrigin(0.25, 0);
        /*this.tile1 = new Tile(this, game.config.width - 32, game.config.height - 96, 'tiles', 7, 5).setOrigin(0.25, 0);
        this.tile1.body.immovable = true;
        this.tile1.body.allowGravity = false;
        this.ground.add(this.tile1);
        this.tiles.push(this.tile1);*/

        //this.tile2 = this.physics.add.sprite(game.config.width - 64, game.config.height - 96, 'tiles', 7).setOrigin(0.25, 0);
        /*this.tile2 = new Tile(this, game.config.width - 64, game.config.height - 96, 'tiles', 7, 5).setOrigin(0.25, 0);
        this.tile2.body.immovable = true;
        this.tile2.body.allowGravity = false;
        this.ground.add(this.tile2);
        this.tiles.push(this.tile2);*/

        //this.spawnPlatform();
        //this.spawnHazard();

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
        if (!this.gameOver) {
            this.score += delta * 0.002;
        }
        this.displayScore = Math.round(this.score);
        this.scoreText.text = this.displayScore;

        // Spawning
        this.spawnTimer += delta;
        if (this.spawnTimer > this.spawnInterval) {
            this.spawnTimer -= this.spawnInterval;
            if(Math.random() > 0.6) {
                this.spawnPlatform();
            } else {
                this.spawnHazard();
            }
        }

        // Player animation and jumping
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

        if(!this.gameOver && Phaser.Input.Keyboard.JustDown(keySPACE) && !this.jumping) {
            this.player.body.setVelocityY(this.jumpVelocity);
            this.jumping = true;
            this.player.play('jump');
        }

        /*if (this.player.body.touching.right) {
            console.log('bump');
            this.gameOver = true;
            //for (let tile of this.tiles) {
            //     tile.body.setVelocityX(0);
            //}
        }*/

        // Tile collision
        for (let tile of this.tiles) {
            // collisions
            /*if (this.checkCollision(this.player, tile)) {
                console.log('collision');
                this.gameOver = true;
            }*/
            if (tile.checkCollision(this.player)) {
                this.gameOver = true;
            }
            // scoring
            if (!tile.scored && tile.x < this.player.x) {
                this.score += tile.scoreValue;
                tile.scored = true;
            }
        } 

        // Tile movement
        if (!this.gameOver) {
            for (let tile of this.tiles) {
                //tile.body.setVelocityX(-this.stageSpeed);
                tile.x -= this.stageSpeed;
            }
        }
    }

    // Spawn platform of random length between max and min
    spawnPlatform() {
        let size = Math.floor(Math.random() * (this.maxPlatformLength - this.minPlatformLength + 1) + this.minPlatformLength);
        for (let i = 0; i < size; i++) {
            let tile = new Tile(this, game.config.width + 32 * (i + 1), game.config.height - 96, 'tiles', 7, 5).setOrigin(0.25, 0);
            tile.body.immovable = true;
            tile.body.allowGravity = false;
            this.ground.add(tile);
            this.tiles.push(tile);
        }
    }

    // Spawn hazard
    spawnHazard() {
        let size = Math.floor(Math.random() * (this.maxHazardLength - this.minPlatformLength + 1) + this.minPlatformLength);
        for (let i = 0; i < size; i++) {
            let tile = new Tile(this, game.config.width + 32 * (i + 1), game.config.height - 96, 'hazards', 0, 10, true).setOrigin(0.25, 0);
            tile.body.immovable = true;
            tile.body.allowGravity = false;
            this.ground.add(tile);
            this.tiles.push(tile);
        }
    }
}