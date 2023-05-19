class Play extends Phaser.Scene {
    constructor() {
        super("playScene");
    }

    preload() {
        // load images
        this.load.image('slime', './assets/slime.png');
    }

    create() {
        // add slime (player)
        this.playerSlime = new Slime(this, game.config.width / 15, game.config.height - game.config.height / 15, 'slime').setOrigin(0.5, 0);

        // define keys
        keySPACE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    }

    update() {
        this.playerSlime.update();
    }
}