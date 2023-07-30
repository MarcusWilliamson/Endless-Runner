/*
Main header
Marcus Williamson
Skate Forever
12 hours

*/

let config = {
    type: Phaser.CANVAS,
    width: 480,
    height: 360,
    scene: [Menu, Play],
    physics: {
        default: 'arcade',
        arcade: {
            debug: true,
            gravity: {
                x: 0,
                y: 2800
            }
        }
    },
    fps: {
        forceSetTimeOut: true,
        target: 60
    }
    
}

let game = new Phaser.Game(config);

let keySPACE;