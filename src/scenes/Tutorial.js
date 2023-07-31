class Tutorial extends Phaser.Scene {
    constructor() {
        super("tutorialScene");
    }

    preload() {
        this.load.spritesheet('tiles', './assets/tiles.png', {frameWidth: 32, frameHeight: 32});
        this.load.spritesheet('hazards', './assets/hazards.png', {frameWidth: 32, frameHeight: 32});
    }

    create() {
         // menu text configuration
         let menuConfig = {
            fontFamily: 'Courier',
            fontSize: '24px',
            backgroundColor: '#F3B141',
            color: '#000000',
            align: 'center',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 0
        }

        let instructions = "Press SPACE to jump.\nScore points by riding on the platforms\nand jumping over the spikes, and surviving.\nDon't crash!"
        let credits = "Game made by Marcus Williamson with Phaser 3.\nAudio made with jsfxr. Royalty-free background\nmusic: \"Next to You\" by Joth on\nOpenGameArt.org."

        this.add.text(game.config.width / 2, game.config.height / 7.5, 'How to Play', menuConfig).setOrigin(0.5);
        menuConfig.fontSize = '16px';
        this.add.text(game.config.width / 2, game.config.height / 3, instructions, menuConfig).setOrigin(0.5);
        this.add.text(game.config.width / 2, game.config.height - game.config.height / 14, 'Press ESC to return', menuConfig).setOrigin(0.5);
        this.add.sprite(game.config.width / 2 - game.config.height / 10, game.config.height / 2 + game.config.height / 15, 'tiles', 7);
        this.add.sprite(game.config.width / 2 + game.config.height / 10, game.config.height / 2 + game.config.height / 15, 'hazards', 0);
        this.add.text(game.config.width / 2, game.config.height / 2 + game.config.height / 4, credits, menuConfig).setOrigin(0.5);

        // define keys
        keySPACE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        keyI = this.input.keyboard.addKey('I');
        keyESC = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
    }

    update() {
        if(Phaser.Input.Keyboard.JustDown(keySPACE) || Phaser.Input.Keyboard.JustDown(keyESC)) {
            this.sound.play('sfx_select');
            this.scene.start("menuScene");
        }
    }

}