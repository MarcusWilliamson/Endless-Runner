/*
Main header
Marcus Williamson
Skate Forever
15 hours

Creative Tilt:
I implemented a custom object pooling function. I tried using Phaser 3's pooling using groups
but I couldn't get it to work, so I made my own with the getInactiveTile function in play.js,
which checks an array of existing obstacles for an inactive obstacle it needs (platform or hazard), sets
its new location and sets it as active, and returns it. If it doesn't find one it creates a new
one. This way I don't constantly create and destroy new obstacles, or just let them pile up off screen.
The game has a 2000s flash game art style and the gameplay is intuitive and quick.

*/

let config = {
    type: Phaser.CANVAS,
    width: 480,
    height: 360,
    scene: [Menu, Play, Tutorial],
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

let keySPACE, keyI, keyESC, keyR;