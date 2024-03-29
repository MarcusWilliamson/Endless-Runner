class Menu extends Phaser.Scene {
    constructor() {
        super("menuScene");
    }

    preload() {
        // load audio
        this.load.audio('sfx_jump', './assets/jump.wav');
        this.load.audio('sfx_hurt', './assets/hurt.wav');
        this.load.audio('sfx_select', './assets/select.wav');
        this.load.audio('music', './assets/Next to You.mp3');
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

        // Play music
        if(music) {
            music.stop();
        }
        
        music = this.sound.add('music', {loop: true});
        if (!music.isPlaying) {
            music.play();
        }
    }

    update() {
        if(Phaser.Input.Keyboard.JustDown(keySPACE)) {
            this.sound.play('sfx_select');
            this.scene.start("playScene");
        }
        if(Phaser.Input.Keyboard.JustDown(keyI)) {
            this.sound.play('sfx_select');
            this.scene.start('tutorialScene');
        }
    }

}