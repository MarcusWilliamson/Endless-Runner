class Tile extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, frame, value, hazard=false) {
        super(scene, x, y, texture, frame);

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.scored = false;
        this.isHazard = hazard;
        this.scoreValue = value;
    }

    update() {
        
    }
    
}