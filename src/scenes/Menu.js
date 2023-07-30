class Menu extends Phaser.Scene {
    constructor() {
        super("menuScene");
    }

    create() {
         // menu text configuration
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

        // show menu text
        this.add.text(game.config.width / 2, game.config.height / 2 - game.config.height / 15, 'Skate Forever', menuConfig).setOrigin(0.5);
        this.add.text(game.config.width / 2, game.config.height / 2, 'Press SPACE to start', menuConfig).setOrigin(0.5);
        this.add.text(game.config.width / 2, game.config.height / 2 + game.config.height / 7.5, 'Press I for help and credits', menuConfig).setOrigin(0.5);

        // define keys
        keySPACE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        keyI = this.input.keyboard.addKey('I');
    }

    update() {
        if(Phaser.Input.Keyboard.JustDown(keySPACE)) {
            this.scene.start("playScene");
        }
        if(Phaser.Input.Keyboard.JustDown(keyI)) {
            this.scene.start('tutorialScene');
        }
    }

}