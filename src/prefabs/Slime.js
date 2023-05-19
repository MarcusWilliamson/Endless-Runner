class Slime extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);

        scene.add.existing(this);
    }

    update() {
        // jump button
        if(Phaser.Input.Keyboard.JustDown(keySPACE)) {
            console.log("JUMP!!!");
        }
    }
    
}